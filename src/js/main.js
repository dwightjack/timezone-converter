import api from './modules/api.js?url';
import day from './modules/day.js?url';
import utils from './modules/utils.js?url';
import cache from './modules/cache.js?url';
import timeZone from './modules/models/timezone-list.js?url';
import timeCard from './modules/models/timecard-list.js?url';
import appState from './modules/models/app-state.js?url';
import appView from './modules/views/app.js?url';
import selectView from './modules/views/select.js?url';
import loaderView from './modules/views/loader.js?url';
import pwaToastView from './modules/views/pwa-toast.js?url';
import timeCardView from './modules/views/timecard.js?url';
import timeCardListView from './modules/views/timecard-list.js?url';
import '../css/main.css';
import { registerSW } from 'virtual:pwa-register';

YUI({
  groups: {
    dayjs: {
      base: 'https://unpkg.com/dayjs@1.10.6/',
      async: false,
      modules: {
        dayjs: {
          path: 'dayjs.min.js',
        },
        'dayjs-utc': {
          path: 'plugin/utc.js',
          requires: ['dayjs'],
        },
        'dayjs-timezone': {
          path: 'plugin/timezone.js',
          requires: ['dayjs', 'dayjs-utc'],
        },
      },
    },
  },
  filter: 'raw',
  modules: {
    'tzc.api': {
      fullpath: api,
      requires: ['datasource', 'dataschema', 'promise', 'cache'],
    },
    'tzc.utils': {
      fullpath: utils,
      requires: ['promise'],
    },
    'tzc.cache': {
      fullpath: cache,
      requires: ['json'],
    },
    'tzc.day': {
      fullpath: day,
      requires: ['dayjs-timezone'],
    },
    'tzc.models.appState': {
      fullpath: appState,
      requires: ['app'],
    },
    'tzc.models.timeZoneList': {
      fullpath: timeZone,
      requires: ['app'],
    },
    'tzc.models.timeCardList': {
      fullpath: timeCard,
      requires: ['app', 'tzc.day'],
    },
    'tzc.views.select': {
      fullpath: selectView,
      requires: ['app'],
    },
    'tzc.views.loader': {
      fullpath: loaderView,
      requires: ['app'],
    },
    'tzc.views.pwaToast': {
      fullpath: pwaToastView,
      requires: ['app'],
    },
    'tzc.views.timeCard': {
      fullpath: timeCardView,
      requires: ['app', 'template-micro', 'tzc.utils', 'anim'],
    },
    'tzc.views.timeCardList': {
      fullpath: timeCardListView,
      requires: ['app', 'tzc.views.timeCard'],
    },
    'tzc.views.app': {
      fullpath: appView,
      requires: [
        'app',
        'tzc.day',
        'tzc.models.timeZoneList',
        'tzc.models.timeCardList',
        'tzc.views.select',
        'tzc.views.timeCardList',
        'tzc.cache',
      ],
    },
  },
}).use(
  'tzc.api',
  'tzc.views.app',
  'tzc.views.loader',
  'tzc.views.pwaToast',
  'tzc.models.appState',
  (Y) => {
    const rootState = new Y.TZC.Models.AppState();

    new Y.TZC.Views.Loader({ container: '#loader' }).render();

    new Y.TZC.Views.PwaToast({
      container: '#toast',
      registerSW,
    }).render();

    Y.TZC.Api.fetchList()
      .then((zonesDB) => {
        new Y.TZC.Views.App({
          container: '#main',
          zonesDB,
        }).render();

        rootState.ready();
      })
      .catch(console.error);
  },
);
