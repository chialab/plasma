import React from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { TestLink } from './src/react/TestLink';
import type { TestLink as HTMLTestLink } from './src/TestLink';

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
        const root = createRoot(host);
        const onStringChange = vi.fn();
        const onClick = vi.fn((event) => event.preventDefault());
        root.render(
            React.createElement(TestLink, {
                'stringProp': 'test',
                'booleanProp': true,
                'numericProp': 1,
                'objectProp': { test: true },
                'data-attr': 'test',
            })
        );
        await awaitReactRender();
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
        root.render(
            React.createElement(TestLink, {
                'onStringchange': onStringChange,
                onClick,
                'stringProp': 'changed',
                'booleanProp': true,
                'numericProp': 1,
                'objectProp': { test: true },
                'data-attr': 'test',
            })
        );
        await awaitReactRender();
        expect(host.innerHTML).toMatchSnapshot();
        expect(onStringChange).toHaveBeenCalled();
        node.click();
        expect(onClick).toHaveBeenCalled();
    });
});
