import { h } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
import 'plasma-test';

const properties = ["stringProp","booleanProp","numericProp","objectProp"];
const events = {"onStringchange":"stringchange"};

export const TestElement = ({ children, ...props }) => {
    const ref = useRef();
    const {
        stringProp,
        booleanProp,
        numericProp,
        objectProp,
        onStringchange,
        ...restProps
    } = props;

    useEffect(() => {
        const listeners = [];

        for (const prop in props) {
            if (prop in events) {
                ref.current.addEventListener(events[prop], props[prop]);
                listeners.push(() => ref.current.removeEventListener(events[prop], props[prop]));
            } else if (properties.includes(prop)) {
                ref.current[prop] = props[prop];
            }
        }

        return () => {
            listeners.forEach((listener) => listener());
        };
    });

    return h('test-element', {
        ref,
        ...restProps,
    }, children);
};