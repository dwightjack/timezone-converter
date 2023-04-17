const { VitePWA } = require('vite-plugin-pwa');
/**
 * @type {import('vite').UserConfig}
 */
module.exports = {
  plugins: [
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
};
