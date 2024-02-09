<script>
    import { onMount, bubble, listen, get_current_component } from 'svelte/internal';
    import 'plasma-test';

    let __ref;
    let __mounted = false;
    let __component = get_current_component();
    let __boundEvents = [];
    let __listeners = [];
    let __on = __component.$on;
    let __state = {
        'stringProp': undefined,
        'booleanProp': undefined,
        'numericProp': undefined,
        'objectProp': undefined,
        'defaultValue': undefined,
    };

    onMount(() => {
        __mounted = true;

        return () => {
            __mounted = false;
        };
    });

    __component.$on = (event, ...args) => {
        if (__mounted) {
            __listeners.push(listen(__ref, event, __forward));
        } else {
            __boundEvents.push(event);
        }

        return __on.call(__component, event, ...args);
    };

    function __assign(props) {
        for (const key in props) {
            if (props[key] !== undefined || __state[key] !== undefined) {
                __state[key] = __ref[key] = props[key];
            }
        }
    }

    function __forward(event) {
        bubble(__component, event);
    }

    function __forwardEvents() {
        while (__boundEvents.length) {
            __listeners.push(listen(__ref, __boundEvents.pop(), __forward));
        }

        return () => {
            __listeners.forEach((unlisten) => unlisten());
        };
    }

    export let stringProp = undefined;
    export let booleanProp = undefined;
    export let numericProp = undefined;
    export let objectProp = undefined;
    export let defaultValue = undefined;

    $: __ref && __mounted && __assign({
        stringProp,
        booleanProp,
        numericProp,
        objectProp,
        defaultValue,
    });
</script>

<a
    bind:this={__ref}
    is="test-link"
    use:__forwardEvents
    {...$$restProps}
><slot name="icon" /><slot /></a>