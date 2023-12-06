import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { TestElement } from './src/svelte/TestElement';
import TestElementRoot from './src/TestElementRoot.svelte';

let host: HTMLElement;

describe('Element', () => {
    beforeEach(() => {
        host = document.createElement('div');
        document.body.appendChild(host);
    });

    afterEach(() => {
        host.remove();
    });

    test('mount component', async () => {
        const instance = new TestElement({
            target: host,
            props: {
                'stringProp': 'test',
                'booleanProp': true,
                'numericProp': 1,
                'objectProp': { test: true },
                'data-attr': 'test',
            },
        });
        const node = host.querySelector('test-element') as HTMLElement;
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

    test('named slot', () => {
        new TestElementRoot({ target: host });
        expect(host.innerHTML).toMatchSnapshot();
    });
});
