import { transformSvelte, type SvelteTransformOptions } from './svelte';
import type { Entry } from './walker';

export enum Frameworks {
    Angular = 'angular',
    Preact = 'preact',
    React = 'react',
    Svelte = 'svelte',
    Vue = 'vue',
}

export const SUPPORTED = [Frameworks.Svelte];
export const UNSUPPORTED = [Frameworks.Angular, Frameworks.Preact, Frameworks.React, Frameworks.Vue];

export * from './walker';

export async function transform<F extends Frameworks>(
    entry: Entry,
    framework: F,
    options: F extends Frameworks.Svelte ? SvelteTransformOptions : never
) {
    switch (framework) {
        case Frameworks.Svelte:
            return transformSvelte(entry, options);
        default:
            throw new Error(`Unsupported framework: ${framework}`);
    }
}
