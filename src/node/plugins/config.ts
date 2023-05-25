import { Plugin, ViteDevServer } from 'vite';
import { SiteConfig } from 'shared/types';
import { relative } from 'path';
import { RestartDevServer } from 'node/dev';

const SITE_DATA_ID = 'decade:site-data';

export function pluginConfig(
  siteConfig: SiteConfig,
  restart: RestartDevServer
): Plugin {
  let server: ViteDevServer | null = null;
  return {
    name: 'decade:site-config',
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        // vite 内部约定 `\0`开头为虚拟模块
        return '\0' + SITE_DATA_ID;
      }
    },
    load(id) {
      if (id === '\0' + SITE_DATA_ID) {
        return `export default ${JSON.stringify(siteConfig.siteData)}`;
      }
    },
    configureServer(s) {
      server = s;
    },
    // 实现修改 config 文件 自动重启 server
    async handleHotUpdate(ctx) {
      const customWatchedFiles = [
        siteConfig.configPath,
        ...(siteConfig.configFileDependencies || []) // config 的依赖文件
      ]; // 需要监听变化的文件
      const include = (id: string) =>
        customWatchedFiles.some((file) => id.includes(file));
      if (include) {
        console.log(
          `\n ${relative(
            siteConfig.root,
            ctx.file
          )} changed, restarting server ...`
        );

        // 实现重启 devServer
        // 方案一 重启 vite devServer
        // await server.restart(); // 发现服务重启了 但是没有重新执行 resolveConfig 的操作
        // 方案二 手动执行 dev.ts createDevServer
        restart();
      }
    }
  };
}
