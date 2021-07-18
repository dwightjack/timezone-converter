import api from './modules/api.js?url';
import timezones from './modules/models/timezone-list.js?url';
import appView from './modules/views/app.js?url';
import '../css/main.css';

let init = true;
if (import.meta.env.DEV) {
  init = import('./dev/msw').then(({ worker }) => worker.start());
}
YUI({
  filter: 'raw',
  modules: {
    'tzc.api': {
      fullpath: api,
      requires: ['datasource', 'dataschema', 'promise', 'cache'],
    },
    'tzc.models.timezoneList': {
      fullpath: timezones,
      requires: ['app'],
    },
    'tzc.views.app': {
      fullpath: appView,
      requires: ['app'],
    },
  },
}).use(
  'tzc.api',
  'tzc.models.timezoneList',
  'tzc.views.app',
  'promise',
  (Y) => {
    const timeZones = new Y.TZC.Models.TimezoneList();
    new Y.TZC.Views.App({
      container: '#main',
      timeZones,
    }).render();

    Y.when(init)
      .then(() => Y.TZC.Api.fetchList())
      .then((zones) => {
        const items = zones.map((name, i) => ({
          id: 'tz-' + i,
          name,
          selected: false,
        }));
        timeZones.reset(items);
      })
      .catch(console.error);
  },
);
