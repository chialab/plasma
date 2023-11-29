import type {
    CustomElementDeclaration,
    CustomElementExport,
    Declaration,
    JavaScriptModule,
    Package,
} from 'custom-elements-manifest';
import type { PackageJson } from './parser';

export interface Entry {
    packageJson: PackageJson;
    manifest: Package;
    module: JavaScriptModule;
    definition: CustomElementExport & { extend?: string };
    declaration: CustomElementDeclaration;
}

function isCustomElementDeclaration(declaration: Declaration): declaration is CustomElementDeclaration {
    return declaration.kind === 'class' && 'customElement' in declaration;
}

export function* candidates(packageJson: PackageJson, manifest: Package): Generator<Entry> {
    for (const module of manifest.modules) {
        if (module.exports) {
            for (const export_ of module.exports) {
                if (export_.kind !== 'custom-element-definition') {
                    continue;
                }
                if (module.declarations) {
                    for (const declaration of module.declarations) {
                        if (!declaration || !isCustomElementDeclaration(declaration)) {
                            continue;
                        }
                        if (declaration.tagName !== export_.name) {
                            continue;
                        }
                        yield { packageJson, manifest, module, definition: export_, declaration };
                    }
                }
            }
        }
    }
}
