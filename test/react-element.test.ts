import React from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { TestElement } from './src/react/TestElement';

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
        const root = createRoot(host);
        const onStringChange = vi.fn();
        const onClick = vi.fn((event) => event.preventDefault());
        root.render(
            React.createElement(TestElement, {
                'stringProp': 'test',
                'booleanProp': true,
                'numericProp': 1,
                'objectProp': { test: true },
                'data-attr': 'test',
            })
        );
        await new Promise((resolve) => setTimeout(resolve, 100));
        const node = host.querySelector('test-element') as HTMLElement;
        expect(host.innerHTML).toMatchSnapshot();
        expect(onStringChange).not.toHaveBeenCalled();
        expect(onClick).not.toHaveBeenCalled();
        root.render(
            React.createElement(TestElement, {
                'onStringchange': onStringChange,
                onClick,
                'stringProp': 'changed',
                'booleanProp': true,
                'numericProp': 1,
                'objectProp': { test: true },
                'data-attr': 'test',
            })
        );
        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(onStringChange).toHaveBeenCalled();
        node.click();
        expect(onClick).toHaveBeenCalled();
    });

    // test('named slot', () => {
    //     new TestElementRoot({ target: host });
    //     expect(host.innerHTML).toMatchSnapshot();
    // });
});
