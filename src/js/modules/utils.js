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

    window.dayjs.extend(window.dayjs_plugin_utc);
    window.dayjs.extend(window.dayjs_plugin_timezone);

    TZC.Day = window.dayjs;
  },
  __APP_VERSION__,
  { requires: ['promise'] },
);
