<script>
    import { onMount, bubble, listen, get_current_component } from 'svelte/internal';
    import 'plasma-test';

    let __ref;
    let __mounted = false;
    let __component = get_current_component();
    let __boundEvents = [];
    let __listeners = [];
    let __on = __component.$on;

    onMount(() => {
        __mounted = true;

        return () => {
            __mounted = false;
        };
    });

    __component.$on = (event, ...args) => {
        if (__mounted) {
            __listeners.push(listen(__ref, event, forward));
        } else {
            __boundEvents.push(event);
        }

        return __on.call(__component, event, ...args);
    };

    function forward(event) {
        bubble(__component, event);
    }

    function forwardEvents() {
        while (__boundEvents.length) {
            __listeners.push(listen(__ref, __boundEvents.pop(), forward));
        }

        return () => {
            __listeners.forEach((unlisten) => unlisten());
        };
    }

    export let stringProp = undefined;
    export let booleanProp = undefined;
    export let numericProp = undefined;
    export let objectProp = undefined;

    $: __ref && __mounted && Object.assign(__ref, { stringProp });
    $: __ref && __mounted && Object.assign(__ref, { booleanProp });
    $: __ref && __mounted && Object.assign(__ref, { numericProp });
    $: __ref && __mounted && Object.assign(__ref, { objectProp });
</script>

<a
    bind:this={__ref}
    is="test-link"
    use:forwardEvents
    {...$$restProps}
><slot name="icon" /><slot /></a>