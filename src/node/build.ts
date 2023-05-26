import { InlineConfig, build as viteBuild } from 'vite';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';
import { join, resolve } from 'path';
import type { RollupOutput } from 'rollup';
import fs from 'fs-extra';
import { pathToFileURL } from 'url';
/**
 * import { writeFile, remove } from 'fs-extra'; 这是 cjs 的包
 * 我们 统一 使用的打包成 esm 的产物 也就是 cli.mjs
 * 所以我们需要开启 "esModuleInterop": true 这个配置
 *
 * import fs from 'fs-extra'; 这行代码就不会报错了
 */

// import ora from 'ora'; ora 这个包的产物只是 esm, 打包后的产物是在node上用的, node 是cjs, require('ora') 这样 require 获取异步模块的
/**
 * const dynamicImport = new Function('m', 'return import(m)');
 * 统一使用 esm 的厚 ora 原本就是 esm, 所以不需要 dynamicImport 这样的黑魔法了
 * 直接import 就好了
 */
import ora from 'ora';
import { SiteConfig } from 'shared/types';
import { createVitePlugins } from './vitePlugin';

export async function bundle(root: string, config: SiteConfig) {
  try {
    // 将config 抽离 通过 isServer 标志区分
    const resolveViteBuildConfig = (isServer: boolean) => {
      return {
        mode: 'production', // 指定模式
        root,
        plugins: [...createVitePlugins({ config })],
        ssr: {
          // 注意加上这个配置，防止 cjs 产物中 require ESM 的产物，因为 react-router-dom 的产物为 ESM 格式
          noExternal: ['react-router-dom']
        },
        build: {
          minify: false,
          ssr: isServer, // 开启ssr
          outDir: isServer ? join('.temp') : 'build', // 指定打包在那个目录
          rollupOptions: {
            input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH, // 打包的入口
            output: {
              format: isServer ? 'cjs' : 'esm' // 打包后代码的 格式
            }
          }
        }
      } as InlineConfig;
    };

    const clientBuild = async () => {
      return viteBuild(resolveViteBuildConfig(false));
    };

    const serverBuild = async () => {
      return viteBuild(resolveViteBuildConfig(true));
    };

    // const { default: ora } = await import('ora'); // 换成 dynamicImport
    /**
     * 笔记说到 可以是用 await import(packageName)来使用 esm 的包
     * 但是这里还是不行, 我们看打包后的产物发现 还是变成 require(packageName)
     * 这是因为 tsc 把 await import 还是编译成了 require
     * const { default: ora } = await Promise.resolve().then(() => require('ora'));
     *
     * 我们怎么 绕过 tsc 呢
     *
     * 使用 dynamicImport
     *
     * const dynamicImport = new Function('m', 'return import(m)');
     */
    const spinner = ora();
    spinner.start('building client + server bundles...');
    // 下面这种写法 serverbuild 其实可以和 clientBuild 同时执行, 所以可以使用 promise.all
    // await clientBuild();
    // await serverBuild();
    const [clientBundle, serverBundle] = await Promise.all([
      clientBuild(),
      serverBuild()
    ]);
    spinner.stop();
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch (e) {
    console.log(e);
  }
}

export async function renderPage(
  render: () => string,
  root: string,
  clientBundle: RollupOutput
) {
  // 从 bundle 中找到 chunk
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );

  console.log('Rendering page in server side...');

  // 获取服务端的 html 字符串
  const appHtml = render();

  // 插入到 html 里面
  // 注释注入 script
  const html = `
  <!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>title</title>
    <meta name="description" content="xxx">
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script type="module" src="/${clientChunk?.fileName}"></script>
  </body>
</html>`.trim();
  // 构建好对应的html 存放在 磁盘上
  await fs.writeFile(join(root, 'build', 'index.html'), html);
  await fs.remove(join(root, '.temp'));
}

export async function build(root: string, config: SiteConfig) {
  // 1. 打包两份 bundle client/server 都是基于 vite 的build
  const [clientBundle, serverBundle] = (await bundle(root, config))!;

  // 2. 引入 server-entry
  const serverEntryPath = resolve(root, '.temp', 'ssr-entry.js');

  // 3. 服务端渲染, 返回 html
  /**
   * const { render } = require(serverEntryPath);
   * 使用esm 统一后 require 改成 import 就好了
   */
  const { render } = await import(pathToFileURL(serverEntryPath).toString());
  await renderPage(render, root, clientBundle);
}
