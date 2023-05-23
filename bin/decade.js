#!/usr/bin/env node
import('../dist/cli.mjs');

// 因为产物已经有 esm 的 所以我们直接使用 esm
// 所以 从 require("../dist/cli") => import("../dist/cli.mjs")
