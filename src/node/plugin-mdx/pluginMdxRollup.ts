import pluginMdx from '@mdx-js/rollup';
import remarkGFM from 'remark-gfm';

export function pluginMdxRollup() {
  return pluginMdx({
    remarkPlugins: [remarkGFM],
    rehypePlugins: []
  });
}
