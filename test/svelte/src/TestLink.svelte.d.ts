import { SvelteComponent } from 'svelte';
import { TestLink as BaseTestLink } from 'plasma-test-svelte';
import { HTMLAnchorAttributes } from 'svelte/elements';
import { EventHandler } from 'svelte/elements';

declare const __propDef: {
    props: HTMLAnchorAttributes & {
        stringProp?: BaseTestLink['stringProp'];
        booleanProp?: BaseTestLink['booleanProp'];
        numericProp?: BaseTestLink['numericProp'];
        objectProp?: BaseTestLink['objectProp'];
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

export type TestLinkProps = typeof __propDef.props;
export type TestLinkEvents = typeof __propDef.events;
export type TestLinkSlots = typeof __propDef.slots;
export default class TestLink extends SvelteComponent<TestLinkProps, TestLinkEvents, TestLinkSlots> {
}
export {};
