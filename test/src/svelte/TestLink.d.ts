import { Component } from 'svelte';
import { TestLink as BaseTestLink } from 'plasma-test';
import { HTMLAnchorAttributes } from 'svelte/elements';

export declare const TestLink: Component<HTMLAnchorAttributes & {
    stringProp?: BaseTestLink['stringProp'];
    booleanProp?: BaseTestLink['booleanProp'];
    numericProp?: BaseTestLink['numericProp'];
    objectProp?: BaseTestLink['objectProp'];
    defaultValue?: BaseTestLink['defaultValue'];
    [`on${string}`]: (event: Event) => void;
}>;
