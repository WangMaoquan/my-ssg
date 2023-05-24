import { createServer } from 'vite';
import { pluginIndexHtml } from './plugins/indexHtml';
import pluginReact from '@vitejs/plugin-react';
import { PACKAGE_ROOT } from './constants';

export function createDevServer(root: string) {
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
