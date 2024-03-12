#! /usr/bin/env node
import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import { program } from 'commander';
import type { Package } from 'custom-elements-manifest';
import { Listr } from 'listr2';
import prompts from 'prompts';
import { candidates, SUPPORTED, transform, UNSUPPORTED, type Frameworks } from './index';
import { findJson, validateManifest } from './utils';

const colorFramework = (framework: string) => {
    switch (framework) {
        case 'svelte':
            return chalk.red(framework);
        case 'angular':
            return chalk.redBright(framework);
        case 'preact':
            return chalk.cyanBright(framework);
        case 'react':
            return chalk.blueBright(framework);
        case 'astro':
            return chalk.yellow(framework);
        case 'vue':
            return chalk.green(framework);
        default:
            return framework;
    }
};

const packageJsonFile = fileURLToPath(new URL('../package.json', import.meta.url));
const json = JSON.parse(await readFile(packageJsonFile, 'utf-8'));
let stdin = '';

program
    .name('plasma')
    .description(json.description)
    .version(json.version)

    .argument('[input]', 'custom elements manifest path')
    .option('-e, --entrypoint <path>', 'module entrypoint')
    .option('-o, --outdir <outdir>', 'output directory')
    .option('-f, --frameworks <frameworks...>', 'the framework to convert to')
    .option('-y, --yes', 'convert all candidates to all available frameworks')

    .action(
        async (
            sourceDir,
            options: {
                entrypoint?: string;
                outdir?: string;
                frameworks?: Frameworks[];
                yes?: boolean;
            }
        ) => {
            let manifest: Package;
            if (stdin) {
                manifest = JSON.parse(stdin);
            } else {
                sourceDir = sourceDir ? resolve(sourceDir) : process.cwd();
                manifest = await findJson<Package>(sourceDir, 'custom-elements.json');
            }
            if (!manifest) {
                throw new Error('No custom elements manifest found');
            }

            validateManifest(manifest);

            let entrypoint = options.entrypoint;
            if (!entrypoint) {
                try {
                    const packageDir = extname(sourceDir) ? dirname(sourceDir) : sourceDir;
                    const packageJson = await findJson<{ name: string }>(packageDir, 'package.json');
                    entrypoint = packageJson.name;
                } catch {
                    //
                }
            }

            if (!entrypoint) {
                throw new Error('No entrypoint found');
            }

            const yes = options.yes || !process.stdout.isTTY;
            const data = Array.from(candidates(manifest));
            if (data.length === 0) {
                throw new Error('No components found');
            }

            let selected: string[];
            if (yes) {
                selected = data.map(({ declaration }) => declaration.name);
            } else {
                selected = (
                    await prompts({
                        type: 'multiselect',
                        name: 'components',
                        message: 'Select components to convert',
                        choices: data.map(({ declaration }) => ({
                            title: declaration.name,
                            value: declaration.name,
                            selected: true,
                        })),
                        instructions: false,
                    })
                ).components;
            }

            let frameworks: Frameworks[];
            if (options.frameworks?.length) {
                frameworks = options.frameworks.filter((framework) => SUPPORTED.includes(framework));
            } else if (yes) {
                frameworks = SUPPORTED;
            } else {
                frameworks = (
                    await prompts({
                        type: 'multiselect',
                        name: 'frameworks',
                        message: 'Select frameworks to convert to',
                        choices: [
                            ...SUPPORTED.map((framework) => ({
                                title: colorFramework(framework),
                                value: framework,
                                selected: true,
                            })),
                            ...UNSUPPORTED.map((framework) => ({
                                title: colorFramework(framework),
                                value: framework,
                                disabled: true,
                            })),
                        ],
                        instructions: false,
                    })
                ).frameworks;
            }

            if (!frameworks || frameworks.length === 0) {
                throw new Error('No frameworks selected');
            }

            const tasks = new Listr(
                selected.map((component) => ({
                    title: `Converting ${component}`,
                    task: (ctx, task) =>
                        task.newListr(
                            frameworks.map((framework) => ({
                                title: `Converting ${chalk.whiteBright(component)} to ${colorFramework(framework)}…`,
                                task: async (ctx, task) => {
                                    const entry = data.find(({ declaration }) => declaration.name === component);
                                    if (!entry) {
                                        throw new Error(`Component not found: ${component}`);
                                    }

                                    const outDir = (options.outdir ?? 'dist/[framework]').replace(
                                        /\[framework\]/g,
                                        framework
                                    );
                                    const outFile = await transform(entry, framework, {
                                        entrypoint: entrypoint as string,
                                        outdir: outDir,
                                    });
                                    task.title = `Converted ${chalk.whiteBright(component)} to ${colorFramework(
                                        framework
                                    )}: ${chalk.grey(outFile)}`;
                                    task.output = outFile;
                                },
                            })),
                            {
                                concurrent: true,
                                // @ts-expect-error Listr typings are wrong
                                rendererOptions: {
                                    collapseSubtasks: false,
                                    persistentOutput: true,
                                },
                            }
                        ),
                })),
                {
                    concurrent: true,
                    // @ts-expect-error Listr typings are wrong
                    rendererOptions: {
                        collapseSubtasks: false,
                        persistentOutput: true,
                    },
                }
            );

            await tasks.run();
        }
    );

if (process.stdin.isTTY) {
    program.parse(process.argv);
} else {
    process.stdin.on('readable', () => {
        let chunk: string;
        while ((chunk = process.stdin.read()) !== null) {
            stdin += chunk.toString();
        }
    });
    process.stdin.on('end', () => {
        program.parse(process.argv);
    });
}
