import { mount, tick, unmount } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { TestLink } from './src/svelte/TestLink';
import type { TestLink as HTMLTestLink } from './src/TestLink';

let host: HTMLElement;
let instance: Record<string, unknown>;

describe('Link', () => {
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
        instance = mount(TestLink, {
            target: host,
            props,
        });
        const node = host.querySelector('a') as HTMLTestLink;
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
});
