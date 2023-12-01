import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { Entry } from './walker';

export interface ReactTransformOptions {
    /**
     * The output directory to write the converted components to.
     */
    outdir: string;
}

function generateReactComponent(entry: Entry) {
    const { packageJson, definition, declaration } = entry;
    let props = '';
    if (declaration.members) {
        for (const member of declaration.members) {
            if (member.kind !== 'field') {
                continue;
            }
            if (member.privacy && member.privacy !== 'public') {
                continue;
            }
            props += `${member.name}, `;
        }
    }

    return `import React, { useRef, useEffect } from 'react';
import '${packageJson.name}';

export const ${declaration.name} = ({ children, ${props}...props }) => {
    const ref = useRef();

    useEffect(() => {
        Object.assign(ref.current, { ${props} });
    });

    return React.createElement(${definition.extend ?? definition.name}, {
        ref,
        ...props,
    }, ...children);
`;
}

function generateReactTypings(entry: Entry) {
    return '';
}

export async function transformReact(entry: Entry, options: ReactTransformOptions) {
    const { declaration } = entry;
    const outFile = join(options.outdir, `${declaration.name}.js`);
    const declFile = `${outFile}.d.ts`;

    await mkdir(dirname(outFile), {
        recursive: true,
    });
    await Promise.all([
        writeFile(outFile, generateReactComponent(entry)),
        writeFile(declFile, generateReactTypings(entry)),
    ]);

    return outFile;
}
