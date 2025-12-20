// @ts-check

import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    site: 'https://genuuid.net',
    adapter: cloudflare({
        imageService: 'compile',
        platformProxy: {
            enabled: true,
        },
    }),
    vite: {
        plugins: [tailwindcss()],
        server: {
            proxy: {
                '/gtf': {
                    target: 'https://eu.i.posthog.com',
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/gtf/, ''),
                },
            },
        },
    },
    integrations: [
        react({
            babel: {
                plugins: [['babel-plugin-react-compiler']],
            },
        }),
        sitemap({
            filter: (page) => !page.includes('/gtf'),
        }),
    ],
    output: 'server',
});
