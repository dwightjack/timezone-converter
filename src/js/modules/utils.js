YUI.add(
  'tzc.utils',
  (Y) => {
    const TZC = Y.namespace('TZC');

    TZC.Utils = {
      transition(fn, wait = 0) {
        return new Y.Promise((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              fn();
              setTimeout(resolve, wait);
            });
          });
        });
      },
    };
  },
  '1.0.0',
  { requires: ['promise'] },
);
