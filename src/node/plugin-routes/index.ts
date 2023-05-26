import { Plugin } from 'vite';
import { RouteService } from './RouteService';

interface PluginRoutesOptions {
  root: string;
}

const CONVENTAIONAL_ROUTE_ID = 'decade:routes';

export function pluginRoutes(options: PluginRoutesOptions): Plugin {
  const routeService = new RouteService(options.root);
  return {
    name: 'decade:plugin-routes',
    async configResolved() {
      await routeService.init();
    },
    resolveId(id) {
      if (id === CONVENTAIONAL_ROUTE_ID) {
        return '\0' + id;
      }
    },
    load(id) {
      if (id === '\0' + CONVENTAIONAL_ROUTE_ID) {
        return routeService.generateRouteCode();
      }
    }
  };
}
