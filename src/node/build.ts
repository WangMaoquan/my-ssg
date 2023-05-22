import { InlineConfig, build as viteBuild } from 'vite';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';

export async function bundle(root: string) {
  try {
    // 将config 抽离 通过 isServer 标志区分
    const resolveViteBuildConfig = (isServer: boolean) => {
      return {
        mode: 'production', // 指定模式
        root,
        build: {
          ssr: isServer, // 开启ssr
          outDir: isServer ? '.temp' : 'build', // 指定打包在那个目录
          rollupOptions: {
            input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH, // 打包的入口
            output: {
              format: isServer ? 'cjs' : 'esm', // 打包后代码的 格式
            },
          },
        },
      } as InlineConfig;
    };

    const clientBuild = async () => {
      return viteBuild(resolveViteBuildConfig(false));
    };

    const serverBuild = async () => {
      return viteBuild(resolveViteBuildConfig(true));
    };

    console.log('building client + server bundles...');
    // 下面这种写法 serverbuild 其实可以和 clientBuild 同时执行, 所以可以使用 promise.all
    // await clientBuild();
    // await serverBuild();
    const [clientBundle, serverBundle] = await Promise.all([
      clientBuild(),
      serverBuild(),
    ]);
    return [clientBundle, serverBundle];
  } catch (e) {
    console.log(e);
  }
}

export async function build(root: string) {
  // 1. 打包两份 bundle client/server 都是基于 vite 的build
  const [clientBundle, serverBundle] = await bundle(root);

  // 2. 引入 server-entry
  // 3. 服务端渲染, 返回 html
}
