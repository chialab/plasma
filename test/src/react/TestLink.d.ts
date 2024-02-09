import React from 'react';
import { TestLink as BaseTestLink } from 'plasma-test';

export const TestLink: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    stringProp?: BaseTestLink['stringProp'];
    booleanProp?: BaseTestLink['booleanProp'];
    numericProp?: BaseTestLink['numericProp'];
    objectProp?: BaseTestLink['objectProp'];
    defaultValue?: BaseTestLink['defaultValue'];
    onStringchange?: React.EventHandler<React.SyntheticEvent<BaseTestLink, CustomEvent>>;
    [key: `data-${string}`]: any;
}>;