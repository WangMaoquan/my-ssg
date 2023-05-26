import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import type { Element, Root } from 'hast';

export const rehypePluginPreWrapper: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'element', (node) => {
      // <pre><code>...</code></pre>
      // 1. 找到 pre
      if (
        node.tagName === 'pre' &&
        node.children[0]?.type === 'element' &&
        node.children[0].tagName === 'code' &&
        !node.data?.isVisited
      ) {
        // 知道 pre, 且 pre 的第一个元素是 code
        const codeNode = node.children[0];
        const codeClassName = codeNode.properties?.className?.toString() || '';
        // lang-js
        const lang = codeClassName.split('-')[1];
        codeNode.properties.className = '';

        /**
         * 将原来的 node 复制
         * 同时我们要生成一个 span 标签装 使用的语言
         * 所以需要在 children 里面加一个
         */
        const cloneNode: Element = {
          type: 'element',
          tagName: 'pre',
          children: node.children,
          data: {
            isVisited: true // 标记 克隆
          }
        };
        // 修改为 div
        node.tagName = 'div';
        node.properties = node.properties || {};
        // 原本的className
        node.properties.className = codeClassName;
        node.children = [
          // 添加span
          {
            type: 'element',
            tagName: 'span',
            properties: {
              className: 'lang'
            },
            children: [
              {
                type: 'text',
                value: lang
              }
            ]
          },
          // 原本的 code
          cloneNode
        ];
      }
    });
  };
};
