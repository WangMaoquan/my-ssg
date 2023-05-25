import { createServer } from 'vite';
import { pluginIndexHtml } from './plugins/indexHtml';
import pluginReact from '@vitejs/plugin-react';
import { PACKAGE_ROOT } from './constants';
import { resolveConfig } from './config';

export async function createDevServer(root: string) {
  // 获取 config 后面两个参数先 写死
  const config = await resolveConfig(root, 'serve', 'development');
  console.log('config', config);
  return createServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact()],
    server: {
      fs: {
        allow: [PACKAGE_ROOT] // 允许访问 根目录下所有文件, 都是合法的
      }
    }
  });
}
