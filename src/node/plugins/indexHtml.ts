import { Plugin } from 'vite';
import { readFile } from 'fs/promises';
import { DEFAULT_TEMPLATE_PATH } from '../constants';

export function pluginIndexHtml(): Plugin {
  return {
    name: 'decade:index-html',
    /**
     * 注册中间件
     * 放在 configureServer 的回调
     *
     * 不以返回函数的方式的话 可能会影响 vite 内置 中间件的逻辑
     */
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          // 读取 template.html 内容
          const content = await readFile(DEFAULT_TEMPLATE_PATH, 'utf-8');
          // 响应 Html 给浏览器
          res.setHeader('Content-Type', 'text/html');
          res.end(content);
        });
      };
    },
  };
}
