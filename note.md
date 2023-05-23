### cjs esm

我们可以在 `mjs` 使用 `cjs` 导出的方法(或者别的)

但是我们不能在 `cjs` 中使用 `mjs` 到处的方法

根本原因在于, 模块的加载机制

`cjs` 是 同步加载模块, 可以理解为 `require` 是一个同步的方法
`esm` 是 异步加载模块

怎么在 `cjs` 中使用 `mjs`

```javascript
async function use() {
  const { add } = await import('/add.mjs');
  console.log(add(1, 2));
}
```
