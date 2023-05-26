import fastGlob from 'fast-glob';
import { relative } from 'path';
import { normalizePath } from 'vite';

interface RouteMeta {
  routePath: string;
  absolutePath: string;
}

export class RouteService {
  #scanDir: string;
  #routeData: RouteMeta[] = [];
  constructor(scanDir: string) {
    this.#scanDir = scanDir;
  }
  async init() {
    /**
     * 第一个参数是 匹配文件
     * 第二参数是 options
     */
    const files = fastGlob
      .sync(['**/*.{js,jsx,ts,tsx,md,mdx}'], {
        cwd: this.#scanDir, // 根目录
        absolute: true, // 返回绝对路径
        ignore: [
          '**/dist/**',
          '**/.decade/**',
          'config.ts',
          '**/build/**',
          'themeConfig.ts'
        ] // 忽略文件
      })
      .sort();

    files.forEach((file) => {
      const fileRelativePath = normalizePath(relative(this.#scanDir, file));
      const routePath = this.normalizeRoutePath(fileRelativePath);
      this.#routeData.push({
        routePath,
        absolutePath: file
      });
    });
  }
  normalizeRoutePath(rawPath: string) {
    // 去掉文件名后缀, 去掉 index
    const routePath = rawPath.replace(/\.(.*)?$/, '').replace(/index$/, '');
    // 需要保证 斜杠开头
    return routePath.startsWith('/') ? routePath : `/${routePath}`;
  }
  getRouteMeta() {
    return this.#routeData;
  }
  /**
   * 拼接 路由
   */
  generateRouteCode() {
    return `
      import React from 'react';
      ${this.#routeData
        .map((route, index) => {
          return `import Route${index} from '${route.absolutePath}'`;
        })
        .join('\n')}
      export const routes = [
        ${this.#routeData.map((route, index) => {
          return `{
            path: '${route.routePath}',
            element: React.createElement(Route${index})
          }`;
        })}
      ]
    `;
  }
}
