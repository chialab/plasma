# @chialab/plasma

## 0.4.0

### Minor Changes

-   5d77c5e: Rollback `styleEntrypoint` option: importing the css module in the svelte file can cause problems with vite preprocessor. The css module should be imported manually.

### Patch Changes

-   8900979: Use `.assign` method for svelte component properties.

## 0.3.4

### Patch Changes

-   8ee0a59: Fix event declarations in svelte.

## 0.3.3

### Patch Changes

-   d989fc5: Improve event handlers typings in Svelte adapter.

## 0.3.2

### Patch Changes

-   2ef631a: Expose real element from Svelte component.
-   e982307: Add event listeners to Svelte known properties.

## 0.3.1

### Patch Changes

-   4943f2c: Discard static fields.

## 0.3.0

### Minor Changes

-   a96f7b9: Add support for Svelte 5.

### Patch Changes

-   0714198: Add `--style` option to support `styleEntrypoint` configuration.

## 0.2.2

### Patch Changes

-   48aa012: Ignore unnamed slots in svelte adapter.

## 0.2.1

### Patch Changes

-   86bd16f: Update node target version.
-   86bd16f: Fix svelte adapter default values.

## 0.2.0

### Minor Changes

-   725c6b4: Do not require a package.json anymore.
-   51d3b64: Support `stdin` manifest.

### Patch Changes

-   ad1927f: Add check for missing components.

## 0.1.1

### Patch Changes

-   026933d: Add `preact` and `react` outputs. Fixes `svelte` output.
