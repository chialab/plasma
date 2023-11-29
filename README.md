# Plasma

Generate Custom Elements wrappers for Angular, React, Svelte and Vue.

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

Options:
  -V, --version                output the version number
  -c, --cwd <path>             current working directory to use
  -f, --framework <framework>  the framework to convert to
  -o, --outdir <outdir>        output directory
  -y, --yes                    convert all candidates to all available frameworks
  -h, --help                   display help for command
```

---

## License

**Plasma** is released under the [MIT](https://github.com/chialab/plasma/blob/main/LICENSE) license.
