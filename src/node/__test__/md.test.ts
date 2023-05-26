import { unified } from 'unified';
import remarkParse from 'remark-parse'; // 解析md 语法
import remarkRehype from 'remark-rehype'; // 解析 html 语法
import remarkStringify from 'rehype-stringify'; // html 序列化

import { describe, test, expect } from 'vitest';

describe('Markdown complie cases', () => {
  const processor = unified();
  // 注册插件
  processor.use(remarkParse).use(remarkRehype).use(remarkStringify);

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
});
