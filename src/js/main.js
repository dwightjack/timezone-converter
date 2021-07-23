import api from './modules/api.js?url';
import timeZoneModule from './modules/models/timezone-list.js?url';
import timeCardModule from './modules/models/timecard-list.js?url';
import appView from './modules/views/app.js?url';
import selectView from './modules/views/select.js?url';
import timeCardView from './modules/views/timecard.js?url';
import timeCardListView from './modules/views/timecard-list.js?url';
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
    'tzc.views.select': {
      fullpath: selectView,
      requires: ['app'],
    },
    'tzc.views.timeCard': {
      fullpath: timeCardView,
      requires: ['app', 'template-micro'],
    },
    'tzc.views.timeCardList': {
      fullpath: timeCardListView,
      requires: ['app', 'tzc.views.timeCard'],
    },
    'tzc.views.app': {
      fullpath: appView,
      requires: [
        'app',
        'tzc.models.timeZoneList',
        'tzc.models.timeCardList',
        'tzc.views.select',
        'tzc.views.timeCardList',
      ],
    },
  },
}).use('tzc.api', 'tzc.views.app', 'promise', (Y) => {
  Y.when(init)
    .then(() => Y.TZC.Api.fetchList())
    .then((zonesDB) => {
      new Y.TZC.Views.App({
        container: '#main',
        zonesDB,
      }).render();
    })
    .catch(console.error);
});
