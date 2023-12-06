import esbuild from 'esbuild';

await esbuild.build({
    entryPoints: ['src/index.ts', 'src/cli.ts'],
    target: 'node16',
    bundle: true,
    splitting: true,
    platform: 'node',
    format: 'esm',
    outdir: './dist',
    banner: {
        js: `import { createRequire as __moduleCreateRequire } from 'module';

const require = __moduleCreateRequire(import.meta.url);
`,
    },
});
