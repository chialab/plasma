import React, { useRef, useEffect } from 'react';
import 'plasma-test';

export const TestElement = ({ children, stringProp, booleanProp, numericProp, objectProp, ...props }) => {
    const ref = useRef();

    useEffect(() => {
        Object.assign(ref.current, { stringProp, booleanProp, numericProp, objectProp,  });
    });

    return React.createElement(test-element, {
        ref,
        ...props,
    }, ...children);
