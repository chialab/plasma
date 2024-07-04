import { render } from '@testing-library/svelte';
import type { SvelteComponent } from 'svelte';
import { describe, expect, test, vi } from 'vitest';
import { TestElement } from './src/svelte/TestElement';
import type { TestElement as HTMLTestElement } from './src/TestElement';
import TestElementRoot from './src/TestElementRoot.svelte';

describe('Element', () => {
    test('mount component', async () => {
        const onClick = vi.fn((event) => event.preventDefault());
        const onStringChange = vi.fn();
        const { rerender, container } = render(TestElement as unknown as new (...args: any[]) => SvelteComponent, {
            'stringProp': 'test',
            'booleanProp': true,
            'numericProp': 1,
            'objectProp': { test: true },
            'data-attr': 'test',
        });
        const node = container.querySelector('test-element') as HTMLTestElement;
        expect(node.stringProp).toBe('test');
        expect(node.booleanProp).toBe(true);
        expect(node.numericProp).toBe(1);
        expect(node.objectProp).toEqual({ test: true });
        expect(node.defaultValue).toBe(0);
        expect(node.getAttribute('data-attr')).toBe('test');
        expect(container.innerHTML).toMatchSnapshot();
        expect(onStringChange).not.toHaveBeenCalled();
        expect(onClick).not.toHaveBeenCalled();
        await rerender({
            onclick: onClick,
            onstringchange: onStringChange,
            stringProp: 'changed',
        });
        expect(container.innerHTML).toMatchSnapshot();
        expect(onStringChange).toHaveBeenCalledOnce();
        node.click();
        expect(onClick).toHaveBeenCalledOnce();
    });

    test('named slot', () => {
        const { container } = render(TestElementRoot);
        expect(container.innerHTML).toMatchSnapshot();
    });
});
