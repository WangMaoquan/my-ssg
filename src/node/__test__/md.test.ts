import { unified, Processor } from 'unified';
import remarkParse from 'remark-parse'; // 解析md 语法
import remarkRehype from 'remark-rehype'; // 解析 html 语法
import remarkStringify from 'rehype-stringify'; // html 序列化

import { describe, test, expect, beforeEach } from 'vitest';
import { rehypePluginPreWrapper } from '../plugin-mdx/rehype-plugins/preWrapper';
import { rehypePluginShiki } from '../plugin-mdx/rehype-plugins/shiki';
import { getHighlighter } from 'shiki';

let processor: Processor | null = null;

beforeEach(() => {
  processor = unified();
  // 注册插件
  processor.use(remarkParse).use(remarkRehype).use(remarkStringify);
});

describe('Markdown complie cases', () => {
  test('Compile title', async () => {
    const mdContent = '# 123';
    const result = processor.processSync(mdContent);
    expect(result.value).toBe('<h1>123</h1>');
    expect(result.value).toMatchInlineSnapshot('"<h1>123</h1>"');
  });

  test('Compile code', () => {
    const mdContent = 'I am using `decade.js`';
    const result = processor.processSync(mdContent);
    expect(result.value).toMatchInlineSnapshot(
      '"<p>I am using <code>decade.js</code></p>"'
    );
  });

  test('Complie code block', () => {
    const mdContent = '```js\nconsole.log(123);\n```';
    const result = processor.processSync(mdContent);
    expect(result.value).toMatchInlineSnapshot(`
      "<pre><code class=\\"language-js\\">console.log(123);
      </code></pre>"
    `);
  });

  test('use preWrapper', () => {
    processor.use(rehypePluginPreWrapper);
    const mdContent = '```js\nconsole.log(123);\n```';
    const result = processor.processSync(mdContent);
    expect(result.value).toMatchInlineSnapshot(`
      "<div class=\\"language-js\\"><span class=\\"lang\\">js</span><pre><code class=\\"\\">console.log(123);
      </code></pre></div>"
    `);
  });

  test('rehypePluginShiki', async () => {
    processor.use(rehypePluginShiki, {
      highlighter: await getHighlighter({
        theme: 'nord'
      })
    });
    const mdContent = '```js\nconsole.log(123);\n```';
    const result = processor.processSync(mdContent);
    expect(result.value).toMatchInlineSnapshot(`
      "<pre class=\\"shiki nord\\" style=\\"background-color: #2e3440ff\\" tabindex=\\"0\\"><code><span class=\\"line\\"><span style=\\"color: #D8DEE9\\">console</span><span style=\\"color: #ECEFF4\\">.</span><span style=\\"color: #88C0D0\\">log</span><span style=\\"color: #D8DEE9FF\\">(</span><span style=\\"color: #B48EAD\\">123</span><span style=\\"color: #D8DEE9FF\\">)</span><span style=\\"color: #81A1C1\\">;</span></span>
      <span class=\\"line\\"></span></code></pre>"
    `);
  });
});
