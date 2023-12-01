import { SvelteComponent } from 'svelte';
import { TestElement as BaseTestElement } from 'plasma-test';
import { EventHandler } from 'svelte/elements';

declare const __propDef: {
    props: {
        stringProp?: BaseTestElement['stringProp'];
        booleanProp?: BaseTestElement['booleanProp'];
        numericProp?: BaseTestElement['numericProp'];
        objectProp?: BaseTestElement['objectProp'];
        'on:stringchange'?: EventHandler<CustomEvent>;
    };
    events: {
        'stringchange': CustomEvent;
        [key: string]: CustomEvent;
    };
    slots: {
        'icon': {};
    };
};

export type TestElementProps = typeof __propDef.props;
export type TestElementEvents = typeof __propDef.events;
export type TestElementSlots = typeof __propDef.slots;
export default class TestElement extends SvelteComponent<TestElementProps, TestElementEvents, TestElementSlots> {
}
export {};
