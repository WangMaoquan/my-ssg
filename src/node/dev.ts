import { createServer } from 'vite';
import { pluginIndexHtml } from './plugins/indexHtml';

export function createDevServer(root: string) {
  return createServer({
    root,
    plugins: [pluginIndexHtml()],
  });
}
