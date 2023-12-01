import React, { useRef, useEffect } from 'react';
import 'plasma-test';

export const TestLink = ({ children, stringProp, booleanProp, numericProp, objectProp, ...props }) => {
    const ref = useRef();

    useEffect(() => {
        Object.assign(ref.current, { stringProp, booleanProp, numericProp, objectProp,  });
    });

    return React.createElement(a, {
        ref,
        ...props,
    }, ...children);
