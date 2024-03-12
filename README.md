# Plasma

Generate Custom Elements wrappers for Angular, React, Svelte and Vue.

> [!NOTE]  
> `plasma` is the imperative form for the Italian verb _plasmare_, _to shape_ in English.

Plasma transformations are based on [Custom Element Manifest](https://github.com/webcomponents/custom-elements-manifest) (CEM) specifications. The CEM is a JSON files that describes a Custom Element, its properties, events and slots. Plasma uses the CEM to generate wrappers for the supported frameworks.

You can generate the CEM for most of the Web Components library using this [Analyzer](https://github.com/open-wc/custom-elements-manifest/tree/master/packages/analyzer).

## Install

```
npm i -D @chialab/plasma
```

## Usage

Plasma will try to autodetect the custom elements manifest (`custom-elements.json`) and will read the entrypoint from the `package.json` if not specified. The output directory will be `./dist/[framework]` by default.

```
npm run plasma
```

## Documentation

-   [Get started](https://chialab.github.io/plasma/guide)
-   [Options](https://chialab.github.io/plasma/guide/options)

---

## License

**Plasma** is released under the [MIT](https://github.com/chialab/plasma/blob/main/LICENSE) license.
