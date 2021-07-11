const pkg = require('./package.json');
/**
 * @type {import('vite').UserConfig}
 */
module.exports = {
  build: {
    assetsInlineLimit: 0,
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
};
