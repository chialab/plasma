import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { TestLink } from './src/svelte/TestLink';
import type { TestLink as HTMLTestLink } from './src/TestLink';

let host: HTMLElement;

describe('Link', () => {
    beforeEach(() => {
        host = document.createElement('div');
        document.body.appendChild(host);
    });

    afterEach(() => {
        host.remove();
    });

    test('mount component', async () => {
        const instance = new TestLink({
            target: host,
            props: {
                'stringProp': 'test',
                'booleanProp': true,
                'numericProp': 1,
                'objectProp': { test: true },
                'data-attr': 'test',
            },
        });
        const node = host.querySelector('a') as HTMLTestLink;
        expect(node.stringProp).toBe('test');
        expect(node.booleanProp).toBe(true);
        expect(node.numericProp).toBe(1);
        expect(node.objectProp).toEqual({ test: true });
        expect(node.defaultValue).toBe(0);
        expect(node.getAttribute('data-attr')).toBe('test');
        const onStringChange = vi.fn();
        instance.$on('stringchange', onStringChange);
        const onClick = vi.fn((event) => event.preventDefault());
        instance.$on('click', onClick);
        expect(instance).toBeTruthy();
        expect(host.innerHTML).toMatchSnapshot();
        expect(onStringChange).not.toHaveBeenCalled();
        expect(onClick).not.toHaveBeenCalled();
        instance.$$set({
            stringProp: 'changed',
        });
        await tick();
        expect(host.innerHTML).toMatchSnapshot();
        expect(onStringChange).toHaveBeenCalled();
        node.click();
        expect(onClick).toHaveBeenCalled();
    });
});
