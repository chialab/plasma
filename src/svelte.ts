import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { filterPublicMemebers } from './utils';
import type { Entry } from './walker';

export interface SvelteTransformOptions {
    /**
     * The module entrypoint.
     */
    entrypoint: string;

    /**
     * The output directory to write the converted components to.
     */
    outdir: string;
}

function getAttributes(tagName: string) {
    switch (tagName) {
        case 'a':
            return 'HTMLAnchorAttributes';
        case 'area':
            return 'HTMLAreaAttributes';
        case 'audio':
            return 'HTMLAudioAttributes';
        case 'base':
            return 'HTMLBaseAttributes';
        case 'blockquote':
            return 'HTMLBlockquoteAttributes';
        case 'body':
            return 'HTMLAttributes<HTMLBodyElement>';
        case 'br':
            return 'HTMLAttributes<HTMLBRElement>';
        case 'button':
            return 'HTMLButtonAttributes';
        case 'canvas':
            return 'HTMLCanvasAttributes';
        case 'col':
            return 'HTMLColAttributes';
        case 'colgroup':
            return 'HTMLColgroupAttributes';
        case 'data':
            return 'HTMLDataAttributes';
        case 'datalist':
            return 'HTMLAttributes<HTMLDataListElement>';
        case 'del':
            return 'HTMLDelAttributes';
        case 'details':
            return 'HTMLDetailsAttributes';
        case 'dialog':
            return 'HTMLDialogAttributes';
        case 'div':
            return 'HTMLAttributes<HTMLDivElement>';
        case 'dl':
            return 'HTMLAttributes<HTMLDListElement>';
        case 'embed':
            return 'HTMLEmbedAttributes';
        case 'fieldset':
            return 'HTMLFieldsetAttributes';
        case 'form':
            return 'HTMLFormAttributes';
        case 'h1':
            return 'HTMLAttributes<HTMLHeadingElement>';
        case 'h2':
            return 'HTMLAttributes<HTMLHeadingElement>';
        case 'h3':
            return 'HTMLAttributes<HTMLHeadingElement>';
        case 'h4':
            return 'HTMLAttributes<HTMLHeadingElement>';
        case 'h5':
            return 'HTMLAttributes<HTMLHeadingElement>';
        case 'h6':
            return 'HTMLAttributes<HTMLHeadingElement>';
        case 'hr':
            return 'HTMLAttributes<HTMLHRElement>';
        case 'html':
            return 'HTMLHtmlAttributes';
        case 'iframe':
            return 'HTMLIframeAttributes';
        case 'img':
            return 'HTMLImgAttributes';
        case 'input':
            return 'HTMLInputAttributes';
        case 'ins':
            return 'HTMLInsAttributes';
        case 'keygen':
            return 'HTMLKeygenAttributes';
        case 'label':
            return 'HTMLLabelAttributes';
        case 'legend':
            return 'HTMLAttributes<HTMLLegendElement>';
        case 'li':
            return 'HTMLLiAttributes';
        case 'link':
            return 'HTMLLinkAttributes';
        case 'map':
            return 'HTMLMapAttributes';
        case 'menu':
            return 'HTMLMenuAttributes';
        case 'meta':
            return 'HTMLMetaAttributes';
        case 'meter':
            return 'HTMLMeterAttributes';
        case 'object':
            return 'HTMLObjectAttributes';
        case 'ol':
            return 'HTMLOlAttributes';
        case 'optgroup':
            return 'HTMLOptgroupAttributes';
        case 'option':
            return 'HTMLOptionAttributes';
        case 'output':
            return 'HTMLOutputAttributes';
        case 'p':
            return 'HTMLAttributes<HTMLParagraphElement>';
        case 'param':
            return 'HTMLParamAttributes';
        case 'pre':
            return 'HTMLAttributes<HTMLPreElement>';
        case 'progress':
            return 'HTMLProgressAttributes';
        case 'q':
            return 'HTMLQuoteAttributes';
        case 'slot':
            return 'HTMLSlotAttributes';
        case 'script':
            return 'HTMLScriptAttributes';
        case 'select':
            return 'HTMLSelectAttributes';
        case 'source':
            return 'HTMLSourceAttributes';
        case 'span':
            return 'HTMLAttributes<HTMLSpanElement>';
        case 'style':
            return 'HTMLStyleAttributes';
        case 'table':
            return 'HTMLTableAttributes';
        case 'template':
            return 'HTMLAttributes<HTMLTemplateElement>';
        case 'tbody':
            return 'HTMLAttributes<HTMLTableSectionElement>';
        case 'td':
            return 'HTMLTdAttributes';
        case 'textarea':
            return 'HTMLTextareaAttributes';
        case 'tfoot':
            return 'HTMLAttributes<HTMLTableSectionElement>';
        case 'th':
            return 'HTMLThAttributes';
        case 'thead':
            return 'HTMLAttributes<HTMLTableSectionElement>';
        case 'time':
            return 'HTMLTimeAttributes';
        case 'title':
            return 'HTMLAttributes<HTMLTitleElement>';
        case 'tr':
            return 'HTMLAttributes<HTMLTableRowElement>';
        case 'track':
            return 'HTMLTrackAttributes';
        case 'ul':
            return 'HTMLAttributes<HTMLUListElement>';
        case 'video':
            return 'HTMLVideoAttributes';
        case 'webview':
            return 'HTMLWebViewAttributes';
        default:
            return 'HTMLAttributes<HTMLElement>';
    }
}

export function generateSvelteComponent(entry: Entry, options: SvelteTransformOptions) {
    const { definition, declaration } = entry;

    const props: string[] = [];
    const setters: string[] = [];
    filterPublicMemebers(declaration).forEach((member) => {
        props.push(`export let ${member.name} = undefined;`);
        setters.push(`$: __ref && __mounted && Object.assign(__ref, { ${member.name} });`);
    });

    const slots = [];
    if (declaration.slots) {
        for (const slot of declaration.slots) {
            slots.push(`<slot name="${slot.name}" />`);
        }
    }
    slots.push('<slot />');

    const markup = definition.extend
        ? `<${definition.extend}
    bind:this={__ref}
    is="${definition.name}"
    use:forwardEvents
    {...$$restProps}
>${slots.join('')}</${definition.extend}>`
        : `<${definition.name}
    bind:this={__ref}
    use:forwardEvents
    {...$$restProps}
>${slots.join('')}</${definition.name}>`;

    return `<script>
    import { onMount, bubble, listen, get_current_component } from 'svelte/internal';
    import '${options.entrypoint}';

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

    ${props.join('\n    ')}

    ${setters.join('\n    ')}
</script>

${markup}`;
}

export function generateSvelteTypings(entry: Entry, options: SvelteTransformOptions) {
    const { definition, declaration } = entry;
    const imports = `import { SvelteComponent } from 'svelte';
import { ${declaration.name} as Base${declaration.name} } from '${options.entrypoint}';
import { ${getAttributes(definition.extend ?? definition.name).split('<')[0]} } from 'svelte/elements';
`;

    const propertiesTypings = filterPublicMemebers(declaration).map(
        (member) => `${member.name}?: Base${declaration.name}['${member.name}'];`
    );

    const eventsTypings = [];
    if (declaration.events) {
        for (const event of declaration.events) {
            eventsTypings.push(`'${event.name}': CustomEvent;`);
        }
    }
    eventsTypings.push('[key: string]: CustomEvent;');

    const slotsTypings = [];
    if (declaration.slots) {
        for (const slot of declaration.slots) {
            slotsTypings.push(`'${slot.name}': {};`);
        }
    }

    const declContents = `
declare const __propDef: {
    props: ${getAttributes(definition.extend ?? definition.name)} & {
        ${propertiesTypings.join('\n        ')}
    };
    events: {
        ${eventsTypings.join('\n        ')}
    };
    slots: {
        ${slotsTypings.join('\n        ')}
    };
};

export type ${declaration.name}Props = typeof __propDef.props;
export type ${declaration.name}Events = typeof __propDef.events;
export type ${declaration.name}Slots = typeof __propDef.slots;
export class ${declaration.name} extends SvelteComponent<${declaration.name}Props, ${declaration.name}Events, ${
        declaration.name
    }Slots> {
}
`;

    return `${imports}${declContents}`;
}

export async function transformSvelte(entry: Entry, options: SvelteTransformOptions) {
    const { declaration } = entry;
    const outFile = join(options.outdir, `${declaration.name}.js`);
    const svelteFile = join(options.outdir, `${declaration.name}.svelte`);
    const declFile = join(options.outdir, `${declaration.name}.d.ts`);

    await mkdir(options.outdir, {
        recursive: true,
    });
    await Promise.all([
        writeFile(
            outFile,
            `import ${declaration.name} from './${declaration.name}.svelte';\n\nexport { ${declaration.name} };`
        ),
        writeFile(svelteFile, generateSvelteComponent(entry, options)),
        writeFile(declFile, generateSvelteTypings(entry, options)),
    ]);

    return outFile;
}
