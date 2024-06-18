import { Component } from 'svelte';
import { TestElement as BaseTestElement } from 'plasma-test';
import { HTMLAttributes } from 'svelte/elements';

export declare const TestElement: Component<HTMLAttributes<HTMLElement> & {
    stringProp?: BaseTestElement['stringProp'];
    booleanProp?: BaseTestElement['booleanProp'];
    numericProp?: BaseTestElement['numericProp'];
    objectProp?: BaseTestElement['objectProp'];
    defaultValue?: BaseTestElement['defaultValue'];
    [`on${string}`]: (event: Event) => void;
}>;
