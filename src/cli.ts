#! /usr/bin/env node
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import chalk from 'chalk';
import { program } from 'commander';
import { Listr } from 'listr2';
import prompts from 'prompts';
import { candidates, SUPPORTED, transform, UNSUPPORTED, type Frameworks } from './index';
import { parseManifestFromPackage, parsePackageJson } from './parser';

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
        case 'vue':
            return chalk.green(framework);
        default:
            return framework;
    }
};

const packageJsonFile = resolve(__dirname, '../package.json');
const json = JSON.parse(readFileSync(packageJsonFile, 'utf-8'));

program
    .name('plasma')
    .description(json.description)
    .version(json.version)

    .argument('<input>', 'Package.json path')
    .requiredOption('-o, --outdir <outdir>', 'Output directory')
    .option('-y, --yes', 'Convert all candidates to all available frameworks')

    .action(async (input, options) => {
        const json = await parsePackageJson(input);
        const manifest = await parseManifestFromPackage(input, json);
        if (!manifest) {
            throw new Error('No custom elements manifest found');
        }

        const data = Array.from(candidates(json, manifest));
        let selected: string[];
        if (options.yes) {
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
        if (options.yes) {
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

        if (!frameworks) {
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

                                const outFile = await transform(entry, framework, {
                                    outdir: join(options.outdir, framework),
                                });
                                task.title = `Converted ${chalk.whiteBright(component)} to ${colorFramework(
                                    framework
                                )}: ${chalk.grey(outFile)}`;
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
    });

program.parse();
