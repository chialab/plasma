import { h, render } from 'preact';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { TestElement } from './src/preact/TestElement';
import type { TestElement as HTMLTestElement } from './src/TestElement';

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
            h(TestElement, {
                'stringProp': 'test',
                'booleanProp': true,
                'numericProp': 1,
                'objectProp': { test: true },
                'data-attr': 'test',
            }),
            host
        );
        await awaitReactRender();
        const node = host.querySelector('test-element') as HTMLTestElement;
        expect(node.stringProp).toBe('test');
        expect(node.booleanProp).toBe(true);
        expect(node.numericProp).toBe(1);
        expect(node.objectProp).toEqual({ test: true });
        expect(node.defaultValue).toBe(0);
        expect(node.getAttribute('data-attr')).toBe('test');
        expect(host.innerHTML).toMatchSnapshot();
        expect(onStringChange).not.toHaveBeenCalled();
        expect(onClick).not.toHaveBeenCalled();
        render(
            h(TestElement, {
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

    test('named slot', async () => {
        render(h(TestElement, {}, ['Hello', h('i', { slot: 'icon', key: 'icon' }, 'icon')]), host);
        expect(host.innerHTML).toMatchSnapshot();
    });
});
