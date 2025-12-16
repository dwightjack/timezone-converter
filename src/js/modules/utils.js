YUI.add(
  'tzc.utils',
  (Y) => {
    const TZC = Y.namespace('TZC');

    let queue = Y.Promise.resolve();

    let viewTransition = (fn) => {
      return Y.when(fn());
    };

    if (document.startViewTransition) {
      viewTransition = (fn) => {
        queue = queue.then(() => document.startViewTransition(fn).ready);
        return queue;
      };
    }

    TZC.Utils = {
      transition($container, fn) {
        return new Y.Promise((resolve) => {
          $container.once('transitionend', resolve);
          Y.Lang.isFunction(fn) && fn();
        });
      },
      viewTransition,
    };
  },
  '1.0.0',
  { requires: ['promise'] },
);
