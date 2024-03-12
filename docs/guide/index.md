# Get started

Generate Custom Elements wrappers for Angular, React, Svelte and Vue.

::: info

`plasma` is the imperative form for the Italian verb _plasmare_, _to shape_ in English.

:::

Plasma transformations are based on [Custom Element Manifest](https://github.com/webcomponents/custom-elements-manifest) (CEM) specifications. The CEM is a JSON files that describes a Custom Element, its properties, events and slots. Plasma uses the CEM to generate wrappers for the supported frameworks.

You can generate the CEM for most of the Web Components library using this [Analyzer](https://github.com/open-wc/custom-elements-manifest/tree/master/packages/analyzer).

## Install

Plasma is published to the NPM registry

::: code-group

```bash [npm]
npm install @chialab/plasma -D
```

```bash [yarn]
yarn add @chialab/plasma -D
```

```bash [pnpm]
pnpm add @chialab/plasma -D
```

:::

## Usage

Plasma will try to autodetect the custom elements manifest (`custom-elements.json`) and will read the entrypoint from the `package.json` if not specified. The output directory will be `./dist/[framework]` by default.

```
npm run plasma
```
