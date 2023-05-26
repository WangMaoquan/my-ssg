import { useRoutes } from 'react-router-dom';
// import A from '../../docs/guide/a';
// import B from '../../docs/b';
// import Index from '../../docs/guide/index';
import { routes } from 'decade:routes';

// 很明显这一块 需要我们自己生成 通过插件
// const routes = [
//   {
//     path: '/guide',
//     element: <Index />
//   },
//   {
//     path: '/guide/a',
//     element: <A />
//   },
//   {
//     path: '/b',
//     element: <B />
//   }
// ];

export const Content = () => {
  console.log(routes);
  const routeElement = useRoutes(routes);
  return routeElement;
};
