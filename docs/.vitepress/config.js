import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: 'Plasma',
    description: 'Generate Custom Elements wrappers for Angular, React, Svelte and Vue',
    base: '/plasma/',
    outDir: '../public',

    head: [['link', { rel: 'icon', href: 'https://www.chialab.it/favicon.png' }]],

    themeConfig: {
        logo: 'https://raw.githubusercontent.com/chialab/dna/main/logo.svg',

        editLink: {
            pattern: 'https://github.com/chialab/plasma/edit/main/docs/:path',
            text: 'Suggest changes to this page',
        },

        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {
                text: 'Home',
                link: '/',
            },
            {
                text: 'Guide',
                link: '/guide/',
            },
            {
                text: 'Ecosystem',
                items: [
                    { text: 'DNA', link: 'https://chialab.github.io/dna/' },
                    { text: 'Quantum', link: 'https://chialab.github.io/quantum/' },
                    { text: 'Loock', link: 'https://chialab.github.io/loock/' },
                    { text: 'Synapse', link: 'https://github.com/chialab/synapse/' },
                ],
            },
            {
                text: 'Chialab.io',
                link: 'https://www.chialab.io',
            },
        ],

        sidebar: [
            {
                text: 'Guide',
                items: [
                    {
                        text: 'Get started',
                        link: '/guide/',
                    },
                    {
                        text: 'Options',
                        link: '/guide/options',
                    },
                    {
                        text: 'Examples',
                        link: '/guide/examples',
                    },
                ],
            },
            {
                text: 'Status',
                link: '/guide/status',
            },
        ],

        socialLinks: [
            {
                icon: 'github',
                link: 'https://github.com/chialab/plasma',
            },
        ],

        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2024 - DNA project - Chialab',
        },
    },
    lastUpdated: true,
});
