<script>
    import 'plasma-test';

    let __ref;
    let __state = {};
    let {
        stringProp,
        booleanProp,
        numericProp,
        objectProp,
        defaultValue,
        ...props
    } = $props();

    function __assign(props) {
        for (const key in props) {
            if (props[key] !== undefined || __state[key] !== undefined) {
                __state[key] = props[key];
                __ref[key] = props[key];
            }
        }
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

<!-- svelte-ignore avoid-is -->
<!-- svelte-ignore a11y-missing-attribute -->
<a
    bind:this={__ref}
    {...props}
    is="test-link"
><slot name="icon" /><slot /></a>