# Examples

Create cross-framework wrappers for a Web Component library:

```bash
npm run plasma \
    --entrypoint @acme/acme-button \
    --outdir './dist/[framework]'
```

Create wrappers for React and Preact only:

```bash
npm run plasma \
    --entrypoint @acme/acme-button \
    --outdir './dist/[framework]' \
    --frameworks react,preact
```

Create wrappers for Svelte only:

```bash
npm run plasma \
    --entrypoint @acme/acme-button \
    --outdir './svelte' \
    --frameworks svelte
```

Specify custom elements manifest path:

```bash
npm run plasma 'dist/custom-elements.json' \
    --entrypoint @acme/acme-button
```
