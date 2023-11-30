import { tick } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import TestElement from './components/TestElement.svelte';

let host: HTMLElement;

describe('Element', () => {
    afterEach(() => {
        host.remove();
    });

    test('mount component', async () => {
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
        expect(onStringChange).toHaveBeenCalled();
        node.click();
        expect(onClick).toHaveBeenCalled();
    });
});
