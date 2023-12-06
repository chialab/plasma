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

In order to run the `plasma` cli you need:

-   a `package.json` file. Plasma uses the `name` field to import the Custom Element definition and the `customElements` field to detect the CEM file;
-   a CEM file. You can generate the CEM for most of the Web Components library using this [Analyzer](https://github.com/open-wc/custom-elements-manifest/tree/master/packages/analyzer).

## Installation

```
npm i -D @chialab/plasma
```

## Usage

Run plasma in the current directory. It will autodetect closest `package.json` to use for wrappers generation.

```
npm run plasma
```

### Options

```
npm run plasma --help

Usage: plasma [options] <input>

Generate Custom Elements wrappers for Angular, React, Svelte and Vue.

Arguments:
  input                             source directory

Options:
  -V, --version                     output the version number
  -f, --frameworks <frameworks...>  the framework to convert to
  -o, --outdir <outdir>             output directory
  -y, --yes                         convert all candidates to all available frameworks
  -h, --help                        display help for command
```

---

## License

**Plasma** is released under the [MIT](https://github.com/chialab/plasma/blob/main/LICENSE) license.
