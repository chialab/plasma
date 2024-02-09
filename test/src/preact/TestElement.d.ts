import { FunctionComponent, JSX } from 'preact';
import { TestElement as BaseTestElement } from 'plasma-test';

export const TestElement: FunctionComponent<JSX.HTMLAttributes<BaseTestElement> & {
    stringProp?: BaseTestElement['stringProp'];
    booleanProp?: BaseTestElement['booleanProp'];
    numericProp?: BaseTestElement['numericProp'];
    objectProp?: BaseTestElement['objectProp'];
    defaultValue?: BaseTestElement['defaultValue'];
    onStringchange?: (this: BaseTestElement, event: CustomEvent) => boolean;
    [key: `data-${string}`]: any;
}>;