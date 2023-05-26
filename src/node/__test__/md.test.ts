import { unified, Processor } from 'unified';
import remarkParse from 'remark-parse'; // 解析md 语法
import remarkRehype from 'remark-rehype'; // 解析 html 语法
import remarkStringify from 'rehype-stringify'; // html 序列化

import { describe, test, expect, beforeEach } from 'vitest';
import { rehypePluginPreWrapper } from '../plugin-mdx/rehype-plugins/preWrapper';

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
});
