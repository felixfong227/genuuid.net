// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
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
    ],
    output: 'server',
});
