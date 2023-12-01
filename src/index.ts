import { transformReact, type ReactTransformOptions } from './react';
import { transformSvelte, type SvelteTransformOptions } from './svelte';
import type { Entry } from './walker';

export enum Frameworks {
    Angular = 'angular',
    Preact = 'preact',
    React = 'react',
    Svelte = 'svelte',
    Vue = 'vue',
}

export const SUPPORTED = [Frameworks.React, Frameworks.Svelte];
export const UNSUPPORTED = [Frameworks.Angular, Frameworks.Preact, Frameworks.Vue];

export * from './walker';
export * from './svelte';
export * from './react';

export async function transform<F extends Frameworks>(
    entry: Entry,
    framework: F,
    options: F extends Frameworks.Svelte
        ? SvelteTransformOptions
        : F extends Frameworks.React
          ? ReactTransformOptions
          : never
) {
    switch (framework) {
        case Frameworks.Svelte:
            return transformSvelte(entry, options);
        case Frameworks.React:
            return transformReact(entry, options);
        default:
            throw new Error(`Unsupported framework: ${framework}`);
    }
}
