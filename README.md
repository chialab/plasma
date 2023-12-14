# Plasma

Generate Custom Elements wrappers for Angular, React, Svelte and Vue.

> `plasma` is the imperative form for the Italian verb _plasmare_, _to shape_ in English.

## Status

| Framework | Base wrapper | Properties | Events | Slots | Typings |
| --------- | :----------: | :--------: | :----: | :---: | :-----: |
| Angular   |      🚧      |     🚧     |   🚧   |  🚧   |   🚧    |
| Preact    |      ✅      |     ✅     |   ✅   |  ✅   |   ✅    |
| React     |      ✅      |     ✅     |   ✅   |  ✅   |   ✅    |
| Svelte    |      ✅      |     ✅     |   ✅   |  ✅   |   ✅    |
| Vue       |      🚧      |     🚧     |   🚧   |  🚧   |   🚧    |

## How it works

Plasma transformations are based on [Custom Element Manifest](https://github.com/webcomponents/custom-elements-manifest) (CEM) specifications. The CEM is a JSON files that describes a Custom Element, its properties, events and slots. Plasma uses the CEM to generate wrappers for the supported frameworks.

You can generate the CEM for most of the Web Components library using this [Analyzer](https://github.com/open-wc/custom-elements-manifest/tree/master/packages/analyzer).

## Installation

```
npm i -D @chialab/plasma
```

## Usage

Plasma will try to autodetect the custom elements manifest (`custom-elements.json`) and will read the entrypoint from the `package.json` if not specified. The output directory will be `./dist/[framework]` by default.

```
npm run plasma
```

### Other samples

Create cross-framework wrappers for a Web Component library:

```
npm run plasma --entrypoint @acme/acme-button --outdir './dist/[framework]'
```

Create wrappers for React and Preact only:

```
npm run plasma --entrypoint @acme/acme-button --outdir './dist/[framework]' --frameworks react,preact
```

Create wrappers for Svelte only:

```
npm run plasma --entrypoint @acme/acme-button --outdir './svelte' --frameworks svelte
```

Specify custom elements manifest path:

```
npm run plasma 'dist/custom-elements.json' --entrypoint @acme/acme-button
```

### Options

```
Usage: plasma [options] <input>

Generate Custom Elements wrappers for Angular, React, Svelte and Vue.

Arguments:
  input                             custom elements manifest path

Options:
  -V, --version                     output the version number
  -e, --entrypoint <path>           entrypoint to the package
  -o, --outdir <outdir>             output directory
  -f, --frameworks <frameworks...>  the framework to convert to
  -y, --yes                         convert all candidates to all available frameworks
  -h, --help                        display help for command
```

---

## License

**Plasma** is released under the [MIT](https://github.com/chialab/plasma/blob/main/LICENSE) license.
