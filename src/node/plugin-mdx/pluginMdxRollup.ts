import pluginMdx from '@mdx-js/rollup';
import remarkGFM from 'remark-gfm';
// 下面两个插件一起使用 给 title 增加锚点
import rehypePluginAutolinkHeadings from 'rehype-autolink-headings';
import rehypePluginSlug from 'rehype-slug';

/**
 * 下面两个插件 实现获取 mdx 元数据
 *
 * mdx 开头
 *
 * ---
 * title: "happy day"
 * ---
 *
 * 这样的
 */
import remarkPluginMDXFrontMatter from 'remark-mdx-frontmatter';
import remarkPluginFrontMatter from 'remark-frontmatter';
import { rehypePluginPreWrapper } from './rehype-plugins/preWrapper';

export function pluginMdxRollup() {
  return pluginMdx({
    remarkPlugins: [
      remarkGFM,
      remarkPluginFrontMatter,
      remarkPluginMDXFrontMatter
    ],
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
      ],
      rehypePluginPreWrapper
    ]
  });
}
