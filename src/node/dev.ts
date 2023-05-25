import { createServer } from 'vite';
import { pluginIndexHtml } from './plugins/indexHtml';
import pluginReact from '@vitejs/plugin-react';
import { PACKAGE_ROOT } from './constants';
import { resolveConfig } from './config';
import { pluginConfig } from './plugins/config';

export type RestartDevServer = () => Promise<void>;

// 增加一个 restart 的回调 用于 配置文件更新后 重启服务 获取最新的 config信息
export async function createDevServer(root: string, restart: RestartDevServer) {
  // 获取 config 后面两个参数先 写死
  const config = await resolveConfig(root, 'serve', 'development');
  console.log('config', config);
  return createServer({
    root: PACKAGE_ROOT, // 如果把 root 设为 docs 目录，那么当你访问约定式路由的时候，Vite 会直接给你返回 tsx 文件的编译结果
    plugins: [pluginIndexHtml(), pluginReact(), pluginConfig(config, restart)],
    server: {
      fs: {
        allow: [PACKAGE_ROOT] // 允许访问 根目录下所有文件, 都是合法的
      }
    }
  });
}
