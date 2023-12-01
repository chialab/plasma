import { h, render } from 'preact';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { TestLink } from './src/preact/TestLink';

let host: HTMLElement;

const awaitReactRender = () => new Promise((resolve) => setTimeout(resolve, 100));

describe('Element', () => {
    beforeEach(() => {
        host = document.createElement('div');
        document.body.appendChild(host);
    });

    afterEach(() => {
        host.remove();
    });

    test('mount component', async () => {
        const onStringChange = vi.fn();
        const onClick = vi.fn((event) => event.preventDefault());
        render(
            h(TestLink, {
                'stringProp': 'test',
                'booleanProp': true,
                'numericProp': 1,
                'objectProp': { test: true },
                'data-attr': 'test',
            }),
            host
        );
        await awaitReactRender();
        const node = host.querySelector('a') as HTMLElement;
        expect(host.innerHTML).toMatchSnapshot();
        expect(onStringChange).not.toHaveBeenCalled();
        expect(onClick).not.toHaveBeenCalled();
        render(
            h(TestLink, {
                'onStringchange': onStringChange,
                onClick,
                'stringProp': 'changed',
                'booleanProp': true,
                'numericProp': 1,
                'objectProp': { test: true },
                'data-attr': 'test',
            }),
            host
        );
        await awaitReactRender();
        expect(host.innerHTML).toMatchSnapshot();
        expect(onStringChange).toHaveBeenCalled();
        node.click();
        expect(onClick).toHaveBeenCalled();
    });
});
