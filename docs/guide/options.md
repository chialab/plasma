# Options

## Input

The custom elements manifest path to use to generate the wrappers. If not specified, it tries to autodetect the file in the current working directory using the `customElements` field in the `package.json`.

## Entrypoint

-   `--entrypoint`, `-e`
-   Type: `string`

The original module entrypoint to use to import component implementation and types.  
If the entrypoint is the main module of the package, it matches the name of NPM module.

## Outdir

-   `--outdir`, `-o`
-   Type: `string`

The output directory where to save the generated wrappers. It allows the use of the `[framework]` placeholder to customize the output path.

## Frameworks

-   `--frameworks`, `-f`
-   Type: `string[]`

The frameworks to convert to. It is a comma separated list of framework names.

## Yes

-   `--yes`, `-y`
-   Type: `boolean`

Convert all candidates to all available frameworks.
