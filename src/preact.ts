import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { capitalize, filterPublicMemebers } from './utils';
import type { Entry } from './walker';

export interface PreactTransformOptions {
    /**
     * The entrypoint to the package.
     */
    entrypoint: string;

    /**
     * The output directory to write the converted components to.
     */
    outdir: string;
}

export function generatePreactComponent(entry: Entry, options: PreactTransformOptions) {
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

    return `import { h } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
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

    return h('${definition.extend ?? definition.name}', {
        ref,${definition.extend ? `\n        is: '${definition.name}',` : ''}
        ...restProps,
    }, children);
};`;
}

export function generatePreactTypings(entry: Entry, options: PreactTransformOptions) {
    const { declaration } = entry;

    const imports = `import { FunctionComponent, JSX } from 'preact';
import { ${declaration.name} as Base${declaration.name} } from '${options.entrypoint}';
`;

    const propertiesTypings = filterPublicMemebers(declaration).map(
        (member) => `${member.name}?: Base${declaration.name}['${member.name}'];`
    );

    const eventTypings =
        declaration.events?.map(
            (event) => `on${capitalize(event.name)}?: (this: Base${declaration.name}, event: CustomEvent) => boolean;`
        ) ?? [];

    return `${imports}
export const ${declaration.name}: FunctionComponent<JSX.HTMLAttributes<Base${declaration.name}> & {
    ${propertiesTypings.join('\n    ')}
    ${eventTypings.join('\n    ')}
    [key: \`data-\${string}\`]: any;
}>;`;
}

export async function transformPreact(entry: Entry, options: PreactTransformOptions) {
    const { declaration } = entry;
    const outFile = join(options.outdir, `${declaration.name}.js`);
    const declFile = join(options.outdir, `${declaration.name}.d.ts`);

    await mkdir(options.outdir, {
        recursive: true,
    });
    await Promise.all([
        writeFile(outFile, generatePreactComponent(entry, options)),
        writeFile(declFile, generatePreactTypings(entry, options)),
    ]);

    return outFile;
}
