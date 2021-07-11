import api from './modules/api.js?url';

YUI({
  modules: {
    'tzc.api': {
      fullpath: api,
      requires: ['datasource', 'promise', 'json-parse'],
    },
  },
}).use('tzc.api', (Y) => {
  Y.TZC.Api.fetchList();
});
