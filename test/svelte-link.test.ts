import { render } from '@testing-library/svelte';
import type { SvelteComponent } from 'svelte';
import { describe, expect, test, vi } from 'vitest';
import { TestLink } from './src/svelte/TestLink';
import type { TestLink as HTMLTestLink } from './src/TestLink';

describe('Link', () => {
    test('mount component', async () => {
        const onClick = vi.fn((event) => event.preventDefault());
        const onStringChange = vi.fn();
        const { rerender, container } = render(TestLink as unknown as new (...args: any[]) => SvelteComponent, {
            'stringProp': 'test',
            'booleanProp': true,
            'numericProp': 1,
            'objectProp': { test: true },
            'data-attr': 'test',
        });
        const node = container.querySelector('a') as HTMLTestLink;
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
});
