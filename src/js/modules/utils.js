YUI.add(
  'tzc.utils',
  (Y) => {
    const TZC = Y.namespace('TZC');

    TZC.Utils = {
      transition($container, fn) {
        return new Y.Promise((resolve) => {
          $container.once('transitionend', resolve);
          Y.Lang.isFunction(fn) && fn();
        });
      },
    };
  },
  '1.0.0',
  { requires: ['promise'] },
);
