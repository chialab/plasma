import { afterEach, describe, expect, test } from 'vitest';
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
        expect(instance).toBeTruthy();
        expect(host.innerHTML).toMatchSnapshot();
    });
});
