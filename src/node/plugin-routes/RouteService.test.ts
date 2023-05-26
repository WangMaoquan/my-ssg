import { describe, expect, test } from 'vitest';
import path from 'path';
import { RouteService } from './RouteService';
import { normalizePath } from 'vite';

describe('RouteService', async () => {
  const testDir = path.join(__dirname, 'fixtures');
  const routeService = new RouteService(testDir);
  await routeService.init();

  test('conventinal route by file structure', () => {
    const routeMeta = routeService.getRouteMeta();
    expect(routeMeta).toMatchInlineSnapshot(`
      [
        {
          "absolutePath": "D:/桌面/my-ssg/src/node/plugin-routes/fixtures/a.md",
          "routePath": "/a",
        },
        {
          "absolutePath": "D:/桌面/my-ssg/src/node/plugin-routes/fixtures/guide/index.mdx",
          "routePath": "/guide/",
        },
      ]
    `);
    // ci 时的路径 是不一样的
    const resultRoutes = routeMeta.map((i) => ({
      ...i,
      absolutePath: i.absolutePath.replace(normalizePath(testDir), 'TEST_DIR')
    }));
    expect(resultRoutes).toMatchInlineSnapshot(`
      [
        {
          "absolutePath": "TEST_DIR/a.md",
          "routePath": "/a",
        },
        {
          "absolutePath": "TEST_DIR/guide/index.mdx",
          "routePath": "/guide/",
        },
      ]
    `);
  });

  test('generate routes code', async () => {
    const generateCode = routeService.generateRouteCode();
    expect(generateCode).toMatchInlineSnapshot(`
      "
            import React from 'react';
            import Route0 from 'D:/桌面/my-ssg/src/node/plugin-routes/fixtures/a.md'
      import Route1 from 'D:/桌面/my-ssg/src/node/plugin-routes/fixtures/guide/index.mdx'
            export const routes = [
              {
                  path: '/a',
                  element: React.createElement(Route0)
                },{
                  path: '/guide/',
                  element: React.createElement(Route1)
                }
            ]
          "
    `);
    const formatCode = generateCode.replaceAll(
      normalizePath(testDir),
      'TEST_DIR'
    );
    expect(formatCode).toMatchInlineSnapshot(`
      "
            import React from 'react';
            import Route0 from 'TEST_DIR/a.md'
      import Route1 from 'TEST_DIR/guide/index.mdx'
            export const routes = [
              {
                  path: '/a',
                  element: React.createElement(Route0)
                },{
                  path: '/guide/',
                  element: React.createElement(Route1)
                }
            ]
          "
    `);
  });
});
