<script>
    import 'plasma-test';

    let {
        children,
        $$slots: __slots = {},
        stringProp,
        booleanProp,
        numericProp,
        objectProp,
        defaultValue,
        ...props
    } = $props();
    let __slot_icon = $derived.by(() => __make_snippet(__slots['icon']));
    let __ref;
    let __state = {};

    function __assign(props) {
        for (const key in props) {
            if (props[key] !== undefined || __state[key] !== undefined) {
                __state[key] = props[key];
                __ref[key] = props[key];
            }
        }
    }

    function __make_snippet(fn) {
        fn = fn || (() => {});
        fn[Symbol.for('svelte.snippet')] = true;
        return fn;
    }

    $effect(() => {
        __assign({
            stringProp,
            booleanProp,
            numericProp,
            objectProp,
            defaultValue,
        });
    });
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<test-element
    bind:this={__ref}
    {...props}
>{@render __slot_icon()}{@render children()}</test-element>