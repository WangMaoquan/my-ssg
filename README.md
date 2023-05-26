### 瞎学习的一个仓库

### CSR (Client Side Render)

特征是 没有页面 HTML 的具体内容, 依靠 JS 来渲染完成页面

存在的问题:

- 首屏加载慢 一方面需要请求数据, 会带来网络 IO 的开销, 另一方面需要通过前端框架来渲染页面, 这又是一部分运行时开销
- 对 SEO 不友好 因为没有完整的 HTML 内容, 无法让搜索引擎爬虫摘取有用的信息

### SSR (Server Side Render)

特征是 在服务端返回完整的 HTML 内容, 也就是说浏览器一开始拿到的就是完整的 HTML 内容, 不需要 JS 执行来完成页面渲染

### SSG (Static Site Generation)

静态站点生成

本质上是构建阶段的 SSR, 在 build 过程中产出完整的 HTML, 将 HTML 保存在 磁盘上

优点:

- 服务器压力小
- 继承 SSR 首屏性能以及 SEO 的优势

不过它也有一定的局限性, 并不适用于数据经常变化的场景

### MDX

[MDX playground](https://mdxjs.com/playground/)

回顾一下 编译

`input ==> parser ==> transform ==> complier ==> output`

第一个步骤是 parse, 也就是 AST 的解析, 我们将内容输入进来之后(如一段 Markdown), 通过一个 Parser 来完成 AST 的解析过程, 随后产出语法树的信息。

第二步是 run, 在这个环节会进行一系列 AST 的转换, 也就是说会有一系列的插件来操作语法树的信息。

最后一步是 stringify, 就是序列化 AST, 将其化为字符串的格式, 作为最终的输出

在 MDX 领域中主要包含两个工具

1. [remark](https://github.com/gnab/remark) 主要用于编译 Markdown 和 JSX
2. [rehype](https://github.com/rehypejs/rehype) 主要用于编译 HTML
