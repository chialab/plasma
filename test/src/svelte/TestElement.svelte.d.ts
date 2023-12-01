import { SvelteComponent } from 'svelte';
import { TestElement as BaseTestElement } from 'plasma-test';
import { HTMLAttributes } from 'svelte/elements';
import { EventHandler } from 'svelte/elements';

declare const __propDef: {
    props: HTMLAttributes<HTMLElement> & {
        stringProp?: BaseTestElement['stringProp'];
        booleanProp?: BaseTestElement['booleanProp'];
        numericProp?: BaseTestElement['numericProp'];
        objectProp?: BaseTestElement['objectProp'];
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