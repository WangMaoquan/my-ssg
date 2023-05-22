import { App } from './App';
import { renderToString } from 'react-dom/server';

/**
 * SSG 本质是构建阶段的 SSR, 而当下的 SSR 会采用同构架构, 也就是同样的组件 需要运行在服务端也要运行在客户端
 *
 * 下面就是 运行在 服务端的 App 代码
 */

export function render() {
  // renderToString 将组件 变成 html 字符串
  return renderToString(<App />);
}
