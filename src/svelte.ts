import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { Entry } from './walker';

export interface SvelteTransformOptions {
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

function generateSvelteComponent(entry: Entry) {
    const { packageJson, definition, declaration } = entry;

    let script = `import { onMount } from 'svelte';
import '${packageJson.name}';
`;

    script += `
let __ref;
let __mounted = false

onMount(() => {
    __mounted = true;

    return () => {
        __mounted = false;
    };
});

`;

    if (declaration.members) {
        for (const member of declaration.members) {
            if (member.kind !== 'field') {
                continue;
            }
            if (member.privacy && member.privacy !== 'public') {
                continue;
            }
            const setter = `$: __ref && __mounted && Object.assign(__ref, { ${member.name} });`;
            if (member.default) {
                script += `export let ${member.name} = ${JSON.parse(member.default)};\n${setter}\n\n`;
            } else {
                script += `export let ${member.name};\n${setter}\n\n`;
            }
        }
    }

    const markup = definition.extend
        ? `<${definition.extend} bind:this={__ref} {...$restProps} is="${definition.name}">
    <slot />
</${definition.extend}>`
        : `<${definition.name} bind:this={__ref} {...$restProps}>
    <slot />
</${definition.name}>`;

    return `<script>
${script
    .trim()
    .split('\n')
    .map((line) => `    ${line}`)
    .join('\n')}
</script>

${markup}`;
}

function generateSvelteTypings(entry: Entry) {
    const { packageJson, definition, declaration } = entry;
    let declContents = `import { SvelteComponent } from 'svelte';
import { ${declaration.name} } from '${packageJson.name}';
`;
    if (definition.extend) {
        declContents += `import { ${getAttributes(definition.extend).split('<')[0]} } from 'svelte/elements';\n`;
    }

    let propertiesTypings = '';
    if (declaration.members) {
        for (const member of declaration.members) {
            if (member.kind !== 'field') {
                continue;
            }
            if (member.privacy && member.privacy !== 'public') {
                continue;
            }
            propertiesTypings += `${member.name}: ${declaration.name}['${member.name}'];\n`;
        }
    }

    declContents += `
declare const __propDef: {
    props: ${definition.extend ? `${getAttributes(definition.extend)} &` : ''} {
${propertiesTypings
    .trim()
    .split('\n')
    .map((line) => `        ${line}`)
    .join('\n')}
    },
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};

export type ${declaration.name}Props = typeof __propDef.props;
export type ${declaration.name}Events = typeof __propDef.events;
export type ${declaration.name}Slots = typeof __propDef.slots;
export default class ${declaration.name} extends SvelteComponent<${declaration.name}Props, ${declaration.name}Events, ${
        declaration.name
    }Slots > {
}
export {};
`;

    return declContents;
}

export async function transformSvelte(entry: Entry, options: SvelteTransformOptions) {
    const { declaration } = entry;
    const outFile = join(options.outdir, `${declaration.name}.svelte`);
    const declFile = `${outFile}.d.ts`;

    await mkdir(dirname(outFile), {
        recursive: true,
    });
    await Promise.all([
        writeFile(outFile, generateSvelteComponent(entry)),
        writeFile(declFile, generateSvelteTypings(entry)),
    ]);

    return outFile;
}
