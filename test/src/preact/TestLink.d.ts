import { FunctionComponent, JSX } from 'preact';
import { TestLink as BaseTestLink } from 'plasma-test';

export const TestLink: FunctionComponent<JSX.HTMLAttributes<BaseTestLink> & {
    stringProp?: BaseTestLink['stringProp'];
    booleanProp?: BaseTestLink['booleanProp'];
    numericProp?: BaseTestLink['numericProp'];
    objectProp?: BaseTestLink['objectProp'];
    defaultValue?: BaseTestLink['defaultValue'];
    onStringchange?: (this: BaseTestLink, event: CustomEvent) => boolean;
    [key: `data-${string}`]: any;
}>;