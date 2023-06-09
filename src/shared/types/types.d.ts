// 全局的类型文件

// 给虚拟模块增加类型
declare module 'decade:site-data' {
  import type { UserConfig } from 'shared/types';
  const siteData: UserConfig;
  export default siteData;
}

declare module 'decade:routes' {
  import type { RouteObject } from 'react-router-dom';
  const routes: RouteObject[];
  export { routes };
}
