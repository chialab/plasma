import { afterEach, describe, expect, test } from 'vitest';
import TestLink from './components/TestLink.svelte';

let host: HTMLElement;

describe('Link', () => {
    afterEach(() => {
        host.remove();
    });

    test('mount component', async () => {
        host = document.createElement('div');
        host.setAttribute('id', 'host');
        document.body.appendChild(host);
        const instance = new TestLink({
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
