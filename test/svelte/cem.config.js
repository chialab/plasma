import { dnaPlugins } from '@chialab/manifest-analyzer-dna-plugin';

export default {
    plugins: dnaPlugins(),
    globs: ['src/**/*.ts'],
    dependencies: false,
};
