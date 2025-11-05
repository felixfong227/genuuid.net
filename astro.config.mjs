// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    adapter: cloudflare({
        imageService: 'compile',
    }),
    vite: {
        plugins: [tailwindcss()],
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
