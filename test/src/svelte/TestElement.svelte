<script>
    import 'plasma-test';

    function __sync(node, props) {
        const state = {};
        const assign = (node, props) => {
            for (const key in props)
                if (props[key] !== undefined || state[key] !== undefined)
                    node[key] = state[key] = props[key];
        };

        assign(node, props);
        return {
            update(newProps) {
                assign(node, newProps);
            },
        };
    }

    export let stringProp = undefined;
    export let booleanProp = undefined;
    export let numericProp = undefined;
    export let objectProp = undefined;
    export let defaultValue = undefined;
</script>

<!-- svelte-ignore attribute_avoid_is -->
<test-element
    {...$$restProps}
    use:__sync={{
        stringProp,
        booleanProp,
        numericProp,
        objectProp,
        defaultValue,
    }}
><slot name="icon" /><slot /></test-element>