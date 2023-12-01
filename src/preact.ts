import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { filterPublicMemebers, isOptionalClassField } from './utils';
import type { Entry } from './walker';

export interface PreactTransformOptions {
    /**
     * The output directory to write the converted components to.
     */
    outdir: string;
}

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function generatePreactComponent(entry: Entry) {
    const { packageJson, definition, declaration } = entry;

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
import '${packageJson.name}';

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

export function generatePreactTypings(entry: Entry) {
    const { packageJson, declaration } = entry;

    const imports = `import { FunctionComponent, JSX } from 'preact';
import { ${declaration.name} as Base${declaration.name} } from '${packageJson.name}';
`;

    const propertiesTypings = filterPublicMemebers(declaration).map(
        (member) =>
            `${member.name}${isOptionalClassField(member) ? '?' : ''}: Base${declaration.name}['${member.name}'];`
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

    await mkdir(dirname(outFile), {
        recursive: true,
    });
    await Promise.all([
        writeFile(outFile, generatePreactComponent(entry)),
        writeFile(declFile, generatePreactTypings(entry)),
    ]);

    return outFile;
}
