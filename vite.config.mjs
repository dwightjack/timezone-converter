import { existsSync, readFileSync } from 'node:fs';
import { access, readFile, writeFile } from 'node:fs/promises';
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

/**
 * @param {string} darkColor
 * @returns {import('vite').Plugin}
 */
const darkManifestPlugin = () => {
  /** @type {string} */
  let absOutDir;

  /** @type {import('vite').ResolvedConfig['logger']} */
  let logger;

  return {
    name: 'dark-manifest',
    enforce: 'post',
    apply: 'build',
    configResolved(config) {
      absOutDir = resolve(config.root, config.build.outDir);
      logger = config.logger;
    },
    async closeBundle() {
      const src = resolve(absOutDir, 'manifest.webmanifest');
      const dest = resolve(absOutDir, 'manifest-dark.webmanifest');
      try {
        await access(src);
      } catch {
        logger.warn('[dark-manifest] manifest.webmanifest not found, skipping');
        return;
      }
      const manifest = JSON.parse(await readFile(src, 'utf-8'));
      manifest.theme_color = 'hsl(0deg 0% 22%)';
      manifest.background_color = 'hsl(0deg 0% 22%)';
      await writeFile(dest, JSON.stringify(manifest));
      logger.info(`[dark-manifest] wrote ${dest}`);
    },
  };
};

export default defineConfig({
  plugins: [
    htmlPlugin(),
    VitePWA({
      disable: !!process.env.VITE_IS_TEST,
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
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/yui-s\.yahooapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'yui-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 90, // <== 90 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
    darkManifestPlugin(),
  ],
  build: {
    assetsInlineLimit: 0,
  },
});
