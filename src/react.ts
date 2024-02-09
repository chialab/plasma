import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { capitalize, filterPublicMemebers } from './utils';
import type { Entry } from './walker';

export interface ReactTransformOptions {
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
            return 'AnchorHTMLAttributes<HTMLAnchorElement>';
        case 'area':
            return 'AreaHTMLAttributes<HTMLAreaElement>';
        case 'audio':
            return 'AudioHTMLAttributes<HTMLAudioElement>';
        case 'base':
            return 'BaseHTMLAttributes<HTMLBaseElement>';
        case 'blockquote':
            return 'BlockquoteHTMLAttributes<HTMLBlockquoteElement>';
        case 'body':
            return 'HTMLAttributes<HTMLBodyElement>';
        case 'br':
            return 'HTMLAttributes<HTMLBRElement>';
        case 'button':
            return 'ButtonHTMLAttributes<HTMLButtonElement>';
        case 'canvas':
            return 'CanvasHTMLAttributes<HTMLCanvasElement>';
        case 'col':
            return 'ColHTMLAttributes<HTMLTableColElement>';
        case 'colgroup':
            return 'ColgroupHTMLAttributes<HTMLColgroupElement>';
        case 'data':
            return 'DataHTMLAttributes<HTMLDataElement>';
        case 'datalist':
            return 'HTMLAttributes<HTMLDataListElement>';
        case 'del':
            return 'DelHTMLAttributes<HTMLDelElement>';
        case 'details':
            return 'DetailsHTMLAttributes<HTMLDetailsElement>';
        case 'dialog':
            return 'DialogHTMLAttributes<HTMLDialogElement>';
        case 'div':
            return 'HTMLAttributes<HTMLDivElement>';
        case 'dl':
            return 'HTMLAttributes<HTMLDListElement>';
        case 'embed':
            return 'EmbedHTMLAttributes<HTMLEmbedElement>';
        case 'fieldset':
            return 'FieldsetHTMLAttributes<HTMLFieldsetElement>';
        case 'form':
            return 'FormHTMLAttributes<HTMLFormElement>';
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
            return 'HtmlHTMLAttributes<HTMLHtmlElement>';
        case 'iframe':
            return 'IframeHTMLAttributes<HTMLIframeElement>';
        case 'img':
            return 'ImgHTMLAttributes<HTMLImgElement>';
        case 'input':
            return 'InputHTMLAttributes<HTMLInputElement>';
        case 'ins':
            return 'InsHTMLAttributes<HTMLInsElement>';
        case 'keygen':
            return 'KeygenHTMLAttributes<HTMLKeygenElement>';
        case 'label':
            return 'LabelHTMLAttributes<HTMLLabelElement>';
        case 'legend':
            return 'HTMLAttributes<HTMLLegendElement>';
        case 'li':
            return 'LiHTMLAttributes<HTMLLiElement>';
        case 'link':
            return 'LinkHTMLAttributes<HTMLLinkElement>';
        case 'map':
            return 'MapHTMLAttributes<HTMLMapElement>';
        case 'menu':
            return 'MenuHTMLAttributes<HTMLMenuElement>';
        case 'meta':
            return 'MetaHTMLAttributes<HTMLMetaElement>';
        case 'meter':
            return 'MeterHTMLAttributes<HTMLMeterElement>';
        case 'object':
            return 'ObjectHTMLAttributes<HTMLObjectElement>';
        case 'ol':
            return 'OlHTMLAttributes<HTMLOlElement>';
        case 'optgroup':
            return 'OptgroupHTMLAttributes<HTMLOptgroupElement>';
        case 'option':
            return 'OptionHTMLAttributes<HTMLOptionElement>';
        case 'output':
            return 'OutputHTMLAttributes<HTMLOutputElement>';
        case 'p':
            return 'HTMLAttributes<HTMLParagraphElement>';
        case 'param':
            return 'ParamHTMLAttributes<HTMLParamElement>';
        case 'pre':
            return 'HTMLAttributes<HTMLPreElement>';
        case 'progress':
            return 'ProgressHTMLAttributes<HTMLProgressElement>';
        case 'q':
            return 'QuoteHTMLAttributes<HTMLQuoteElement>';
        case 'slot':
            return 'SlotHTMLAttributes<HTMLSlotElement>';
        case 'script':
            return 'ScriptHTMLAttributes<HTMLScriptElement>';
        case 'select':
            return 'SelectHTMLAttributes<HTMLSelectElement>';
        case 'source':
            return 'SourceHTMLAttributes<HTMLSourceElement>';
        case 'span':
            return 'HTMLAttributes<HTMLSpanElement>';
        case 'style':
            return 'StyleHTMLAttributes<HTMLStyleElement>';
        case 'table':
            return 'TableHTMLAttributes<HTMLTableElement>';
        case 'template':
            return 'HTMLAttributes<HTMLTemplateElement>';
        case 'tbody':
            return 'HTMLAttributes<HTMLTableSectionElement>';
        case 'td':
            return 'TdHTMLAttributes<HTMLTableDataCellElement>';
        case 'textarea':
            return 'TextareaHTMLAttributes<HTMLTextareaElement>';
        case 'tfoot':
            return 'HTMLAttributes<HTMLTableSectionElement>';
        case 'th':
            return 'ThHTMLAttributes<HTMLTableHeaderCellElement>';
        case 'thead':
            return 'HTMLAttributes<HTMLTableSectionElement>';
        case 'time':
            return 'TimeHTMLAttributes<HTMLTimeElement>';
        case 'title':
            return 'HTMLAttributes<HTMLTitleElement>';
        case 'tr':
            return 'HTMLAttributes<HTMLTableRowElement>';
        case 'track':
            return 'TrackHTMLAttributes<HTMLTrackElement>';
        case 'ul':
            return 'HTMLAttributes<HTMLUListElement>';
        case 'video':
            return 'VideoHTMLAttributes<HTMLVideoElement>';
        case 'webview':
            return 'WebViewHTMLAttributes<HTMLWebViewElement>';
        default:
            return 'HTMLAttributes<HTMLElement>';
    }
}

export function generateReactComponent(entry: Entry, options: ReactTransformOptions) {
    const { definition, declaration } = entry;

    const props = filterPublicMemebers(declaration).map((member) => member.name);
    const eventProps =
        declaration.events?.reduce(
            (acc, event) => ({
                ...acc,
                [`on${capitalize(event.name)}`]: event.name,
            }),
            {} as Record<string, string>
        ) ?? {};

    return `import React, { useRef, useEffect } from 'react';
import '${options.entrypoint}';

const properties = ${JSON.stringify(props)};
const events = ${JSON.stringify(eventProps)};

export const ${declaration.name} = ({ children, ...props }) => {
    const ref = useRef();
    const {
        ${props.join(',\n        ')},
        ${Object.keys(eventProps).join(',\n        ')},
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

    return React.createElement('${definition.extend ?? definition.name}', {
        ref,${definition.extend ? `\n        is: '${definition.name}',` : ''}
        ...restProps,
    }, children);
};`;
}

export function generateReactTypings(entry: Entry, options: ReactTransformOptions) {
    const { definition, declaration } = entry;

    const imports = `import React from 'react';
import { ${declaration.name} as Base${declaration.name} } from '${options.entrypoint}';
`;

    const propertiesTypings = filterPublicMemebers(declaration).map(
        (member) => `${member.name}?: Base${declaration.name}['${member.name}'];`
    );

    const eventTypings =
        declaration.events?.map(
            (event) =>
                `on${capitalize(event.name)}?: React.EventHandler<React.SyntheticEvent<Base${
                    declaration.name
                }, CustomEvent>>;`
        ) ?? [];

    return `${imports}
export const ${declaration.name}: React.FC<React.${getAttributes(definition.extend ?? definition.name)} & {
    ${propertiesTypings.join('\n    ')}
    ${eventTypings.join('\n    ')}
    [key: \`data-\${string}\`]: any;
}>;`;
}

export async function transformReact(entry: Entry, options: ReactTransformOptions) {
    const { declaration } = entry;
    const outFile = join(options.outdir, `${declaration.name}.js`);
    const declFile = join(options.outdir, `${declaration.name}.d.ts`);

    await mkdir(options.outdir, {
        recursive: true,
    });
    await Promise.all([
        writeFile(outFile, generateReactComponent(entry, options)),
        writeFile(declFile, generateReactTypings(entry, options)),
    ]);

    return outFile;
}
