---
'@chialab/plasma': minor
---

Rollback `styleEntrypoint` option: importing the css module in the svelte file can cause problems with vite preprocessor. The css module should be imported manually.
