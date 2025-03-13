import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const htmlPlugin = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return html.replace(/\{TEMPLATE:([^}]+)\}/g, (_, match) => {
        const template = resolve(__dirname, match);
        if (!existsSync(template)) {
          console.error(`Unable to locate template: ${template}`);
          return '';
        }
        return readFileSync(template, 'utf8');
      });
    },
  };
};

export default defineConfig({
  plugins: [
    htmlPlugin(),
    VitePWA({
      manifest: {
        name: 'Timezone Converter',
        short_name: 'Timezone Converter',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        theme_color: '#f5f5f5',
        background_color: '#f5f5f5',
        display: 'standalone',
      },
    }),
  ],
  build: {
    assetsInlineLimit: 0,
  },
});
