import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Text, Root } from 'hast';
import { fromHtml } from 'hast-util-from-html';
import { Highlighter } from 'shiki';

interface ShikiOptions {
  highlighter: Highlighter;
}

export const rehypePluginShiki: Plugin<[ShikiOptions], Root> = ({
  highlighter
}) => {
  return (tree) => {
    // node 当前节点, index 当前节点在父节点的索引, parent 父节点
    visit(tree, 'element', (node, index, parent) => {
      // <pre><code>...</code></pre>
      if (
        node.tagName === 'pre' &&
        node.children[0].type === 'element' &&
        node.children[0].tagName === 'code'
      ) {
        // 语法名称, 代码内容 提供给 shiki
        const codeNode = node.children[0];
        const codeContent = (codeNode.children[0] as Text).value;
        const codeClassName = codeNode.properties?.className?.toString() || '';
        const lang = codeClassName.split('-')[1];
        if (!lang) {
          return;
        }
        const highlightedCode = highlighter.codeToHtml(codeContent, {
          lang
        });
        // 将 html 转换成 ast
        const fragmentAst = fromHtml(highlightedCode, {
          fragment: true
        });
        // 替换掉原来的 node
        parent.children.splice(index, 1, ...fragmentAst.children);
      }
    });
  };
};
