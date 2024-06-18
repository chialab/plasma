import { mount, tick, unmount } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { TestElement } from './src/svelte/TestElement';
import type { TestElement as HTMLTestElement } from './src/TestElement';
import TestElementRoot from './src/TestElementRoot.svelte';

let host: HTMLElement;
let instance: Record<string, unknown>;

describe('Element', () => {
    beforeEach(() => {
        host = document.createElement('div');
        document.body.appendChild(host);
    });

    afterEach(() => {
        if (instance) {
            unmount(instance);
        }
        host.remove();
    });

    test('mount component', async () => {
        const onClick = vi.fn((event) => event.preventDefault());
        const onStringChange = vi.fn();
        const props = $state({
            'stringProp': 'test',
            'booleanProp': true,
            'numericProp': 1,
            'objectProp': { test: true },
            'data-attr': 'test',
            'onclick': (event: Event) => {},
            'onstringchange': () => {},
        });
        instance = mount(TestElement, {
            target: host,
            props,
        });
        const node = host.querySelector('test-element') as HTMLTestElement;
        expect(node.stringProp).toBe('test');
        expect(node.booleanProp).toBe(true);
        expect(node.numericProp).toBe(1);
        expect(node.objectProp).toEqual({ test: true });
        expect(node.defaultValue).toBe(0);
        expect(node.getAttribute('data-attr')).toBe('test');
        expect(host.innerHTML).toMatchSnapshot();
        expect(onStringChange).not.toHaveBeenCalled();
        expect(onClick).not.toHaveBeenCalled();
        props.onclick = onClick;
        props.onstringchange = onStringChange;
        props.stringProp = 'changed';
        await tick();
        expect(host.innerHTML).toMatchSnapshot();
        expect(onStringChange).toHaveBeenCalledOnce();
        node.click();
        expect(onClick).toHaveBeenCalledOnce();
    });

    test('named slot', () => {
        instance = mount(TestElementRoot, { target: host });
        expect(host.innerHTML).toMatchSnapshot();
    });
});
