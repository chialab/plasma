import { SvelteComponent } from 'svelte';
import { TestElement as BaseTestElement } from 'plasma-test';
import { HTMLAttributes, type EventHandler } from 'svelte/elements';

declare const __propDef: {
    props: Omit<HTMLAttributes<HTMLElement>, 'stringProp' | 'booleanProp' | 'numericProp' | 'objectProp' | 'defaultValue' | 'onstringchange'> & {
        stringProp?: BaseTestElement['stringProp'];
        booleanProp?: BaseTestElement['booleanProp'];
        numericProp?: BaseTestElement['numericProp'];
        objectProp?: BaseTestElement['objectProp'];
        defaultValue?: BaseTestElement['defaultValue'];
        onstringchange?: EventHandler<CustomEvent, Basestringchange>;
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
export class TestElement extends SvelteComponent<TestElementProps, TestElementEvents, TestElementSlots> {
    getElement(): BaseTestElement;
}
