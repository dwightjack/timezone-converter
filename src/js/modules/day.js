YUI.add(
  'tzc.day',
  (Y) => {
    const TZC = Y.namespace('TZC');

    window.dayjs.extend(window.dayjs_plugin_utc);
    window.dayjs.extend(window.dayjs_plugin_timezone);

    TZC.Day = window.dayjs;
  },
  __APP_VERSION__,
  { requires: ['dayjs-timezone'] },
);
