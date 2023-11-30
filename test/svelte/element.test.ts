import { tick } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import TestElement from './components/TestElement.svelte';

let host: HTMLElement;

describe('Element', () => {
    afterEach(() => {
        host.remove();
    });

    test('mount component', async () => {
        const spy = vi.fn();
        host = document.createElement('div');
        host.setAttribute('id', 'host');
        document.body.appendChild(host);
        const instance = new TestElement({
            target: host,
            props: {
                stringProp: 'test',
                booleanProp: true,
                numericProp: 1,
                objectProp: { test: true },
            },
        });
        instance.$on('stringchange', spy);
        expect(instance).toBeTruthy();
        expect(host.innerHTML).toMatchSnapshot();
        expect(spy).not.toHaveBeenCalled();
        instance.$$set({
            stringProp: 'changed',
        });
        await tick();
        expect(spy).toHaveBeenCalled();
    });
});
