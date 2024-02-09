import React from 'react';
import { TestElement as BaseTestElement } from 'plasma-test';

export const TestElement: React.FC<React.HTMLAttributes<HTMLElement> & {
    stringProp?: BaseTestElement['stringProp'];
    booleanProp?: BaseTestElement['booleanProp'];
    numericProp?: BaseTestElement['numericProp'];
    objectProp?: BaseTestElement['objectProp'];
    defaultValue?: BaseTestElement['defaultValue'];
    onStringchange?: React.EventHandler<React.SyntheticEvent<BaseTestElement, CustomEvent>>;
    [key: `data-${string}`]: any;
}>;