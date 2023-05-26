import pluginMdx from '@mdx-js/rollup';
import remarkGFM from 'remark-gfm';
// 下面两个插件一起使用 给 title 增加锚点
import rehypePluginAutolinkHeadings from 'rehype-autolink-headings';
import rehypePluginSlug from 'rehype-slug';

export function pluginMdxRollup() {
  return pluginMdx({
    remarkPlugins: [remarkGFM],
    rehypePlugins: [
      rehypePluginSlug,
      [
        rehypePluginAutolinkHeadings,
        {
          properties: {
            class: 'header-anchor'
          },
          content: {
            type: 'text',
            value: '#'
          }
        }
      ]
    ]
  });
}
