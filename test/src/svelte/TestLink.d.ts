import { SvelteComponent } from 'svelte';
import { TestLink as BaseTestLink } from 'plasma-test';
import { HTMLAnchorAttributes } from 'svelte/elements';

declare const __propDef: {
    props: HTMLAnchorAttributes & {
        stringProp?: BaseTestLink['stringProp'];
        booleanProp?: BaseTestLink['booleanProp'];
        numericProp?: BaseTestLink['numericProp'];
        objectProp?: BaseTestLink['objectProp'];
        defaultValue?: BaseTestLink['defaultValue'];
        onstringchange?: (event: CustomEvent) => boolean;
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
export class TestLink extends SvelteComponent<TestLinkProps, TestLinkEvents, TestLinkSlots> {
    getElement(): BaseTestLink;
}
