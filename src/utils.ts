import type { ClassField, CustomElementDeclaration } from 'custom-elements-manifest';

export function filterPublicMemebers(declaration: CustomElementDeclaration) {
    if (!declaration.members) {
        return [];
    }

    return declaration.members.filter((member) => {
        if (member.kind !== 'field') {
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
