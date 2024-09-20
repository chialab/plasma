<script>
    import 'plasma-test';

    function __sync(node, props) {
        const state = {};
        const assign = typeof node.assign === 'function' ?
            node.assign.bind(node) :
            (props) => Object.assign(node, props);
        const sync = (node, props) => {
            assign(Object.entries(props).reduce((acc, [key, value]) => {
                if (props[key] !== undefined || state[key] !== undefined) {
                    acc[key] = state[key] = props[key];
                }
                return acc;
            }, {}));
        };

        sync(node, props);
        return {
            update(newProps) {
                sync(node, newProps);
            },
        };
    }

    let __element;
    export function getElement() {
        return __element;
    }

    export let stringProp = undefined;
    export let booleanProp = undefined;
    export let numericProp = undefined;
    export let objectProp = undefined;
    export let defaultValue = undefined;
</script>

<!-- svelte-ignore attribute_avoid_is -->
<test-element
    bind:this={__element}
    {...$$restProps}
    use:__sync={{
        stringProp,
        booleanProp,
        numericProp,
        objectProp,
        defaultValue,
    }}
><slot name="icon" /><slot /></test-element>