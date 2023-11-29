import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import type { Package } from 'custom-elements-manifest';
import type { PackageJson as PackageJsonBase } from 'type-fest';

export type PackageJson = PackageJsonBase & {
    customElements?: string;
};

export async function parseJson(fileName: string) {
    const contents = await readFile(fileName, 'utf-8');
    const json = JSON.parse(contents);

    return json;
}

export async function parsePackageJson(fileName: string) {
    return JSON.parse(await readFile(fileName, 'utf-8')) as PackageJson;
}

export async function parseManifestFromPackage(fileName: string, data: PackageJson) {
    if (!data.customElements) {
        return null;
    }

    return parseJson(resolve(dirname(fileName), data.customElements)) as Promise<Package>;
}
