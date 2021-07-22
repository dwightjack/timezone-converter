import api from './modules/api.js?url';
import timeZoneModule from './modules/models/timezone-list.js?url';
import timeCardModule from './modules/models/timecard-list.js?url';
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
    'tzc.models.timeZoneList': {
      fullpath: timeZoneModule,
      requires: ['app'],
    },
    'tzc.models.timeCardList': {
      fullpath: timeCardModule,
      requires: ['app'],
    },
    'tzc.views.app': {
      fullpath: appView,
      requires: ['app'],
    },
  },
}).use(
  'tzc.api',
  'tzc.models.timeZoneList',
  'tzc.models.timeCardList',
  'tzc.views.app',
  'promise',
  (Y) => {
    const timeZones = new Y.TZC.Models.TimeZoneList();

    Y.when(init)
      .then(() => Y.TZC.Api.fetchList())
      .then((zones) => {
        const items = zones.map(({ name }) => ({
          label: name.replace(/_/g, ' '),
          name,
          selected: false,
        }));
        timeZones.reset(items);
        new Y.TZC.Views.App({
          container: '#main',
          timeZones,
        }).render();
      })
      .catch(console.error);
  },
);
