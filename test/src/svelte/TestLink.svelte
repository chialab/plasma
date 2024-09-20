<script>
    import 'plasma-test';

    function __sync(node, props) {
        const state = {};
        const assign = (node, props) => {
            node.assign(Object.entries(props).reduce((acc, [key, value]) => {
                if (props[key] !== undefined || state[key] !== undefined) {
                    acc[key] = state[key] = props[key];
                }
                return acc;
            }, {}));
        };

        assign(node, props);
        return {
            update(newProps) {
                assign(node, newProps);
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
<a
    bind:this={__element}
    is="test-link"
    {...$$restProps}
    use:__sync={{
        stringProp,
        booleanProp,
        numericProp,
        objectProp,
        defaultValue,
    }}
><slot name="icon" /><slot /></a>