import { dnaPlugins } from '@chialab/manifest-analyzer-dna-plugin';

export default {
    plugins: dnaPlugins(),
    globs: ['index.ts'],
    dependencies: false,
};
