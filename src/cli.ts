#! /usr/bin/env node
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import chalk from 'chalk';
import { program } from 'commander';
import { Listr } from 'listr2';
import { packageUp } from 'package-up';
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

    .option('-c, --cwd <path>', 'current working directory to use')
    .option('-f, --framework <framework>', 'the framework to convert to')
    .requiredOption('-o, --outdir <outdir>', 'output directory')
    .option('-y, --yes', 'convert all candidates to all available frameworks')

    .action(async (options) => {
        const cwd = options.cwd ?? process.cwd();
        const yes = options.yes || !process.stdout.isTTY;

        const input = await packageUp({ cwd });
        if (!input) {
            throw new Error('No package.json found');
        }

        const json = await parsePackageJson(input);
        const manifest = await parseManifestFromPackage(input, json);
        if (!manifest) {
            throw new Error('No custom elements manifest found');
        }

        const data = Array.from(candidates(json, manifest));
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
        if (yes) {
            frameworks = SUPPORTED;
        } else if (options.framework) {
            frameworks = [options.framework].filter((framework) => SUPPORTED.includes(framework));
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

                                const outFile = await transform(entry, framework, {
                                    outdir: options.framework ? options.outdir : join(options.outdir, framework),
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
