import { Plugin } from 'vite';
import { SiteConfig } from 'shared/types';

const SITE_DATA_ID = 'decade:site-data';

export function pluginConfig(siteConfig: SiteConfig): Plugin {
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
    }
  };
}
