import { dnaPlugins } from '@chialab/manifest-analyzer-dna-plugin';

export default {
    plugins: dnaPlugins(),
    globs: ['test/src/**/*.ts'],
    dependencies: false,
};
