import { access, readFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import type { ClassField, CustomElementDeclaration, Package } from 'custom-elements-manifest';

export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function filterPublicMemebers(declaration: CustomElementDeclaration) {
    if (!declaration.members) {
        return [];
    }

    return declaration.members.filter((member) => {
        if (member.kind !== 'field' || member.static) {
            return false;
        }
        if (member.privacy && member.privacy !== 'public') {
            return false;
        }
        return true;
    }) as ClassField[];
}

export function isOptionalClassField(member: ClassField) {
    return (
        member.type?.text
            .split('|')
            .map((type) => type.trim())
            .includes('undefined') ?? true
    );
}

export async function parseJson(fileName: string) {
    const contents = await readFile(fileName, 'utf-8');
    const json = JSON.parse(contents);

    return json;
}

export async function findJson<T = {}>(from: string, name: string) {
    if (extname(from) === '.json') {
        return parseJson(from) as Promise<T>;
    }

    const packageJsonFile = join(from, name);
    try {
        await access(packageJsonFile);

        return parseJson(packageJsonFile) as Promise<T>;
    } catch {
        const dir = dirname(from);
        if (dir === from) {
            throw new Error(`No ${name} found`);
        }

        return findJson(dir, name);
    }
}

export function validateManifest(manifest: Package) {
    if (!manifest.schemaVersion) {
        throw new Error('Malformed custom elements manifest: missing schemaVersion field');
    }
    if (typeof manifest.schemaVersion !== 'string') {
        throw new Error('Malformed custom elements manifest: schemaVersion is not a string');
    }
    if (manifest.modules == null) {
        throw new Error('Malformed custom elements manifest: missing modules field');
    }
    if (!Array.isArray(manifest.modules)) {
        throw new Error('Malformed custom elements manifest: modules is not an array');
    }
}
