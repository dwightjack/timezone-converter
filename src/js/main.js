import api from './modules/api.js?url';
import timezones from './modules/models/timezone-list.js?url';
import '../css/main.css';

let init = true;

if (import.meta.env.DEV) {
  init = import('./dev/msw').then(({ worker }) => worker.start());
}
YUI({
  modules: {
    'tzc.api': {
      fullpath: api,
      requires: ['datasource', 'dataschema', 'promise', 'cache'],
    },
    'tzc.models.timezoneList': {
      fullpath: timezones,
      requires: ['model'],
    },
  },
}).use('tzc.api', 'promise', (Y) => {
  Y.when(init).then(() => {
    const timeZones = new Y.TZC.Models.TimezoneList();
    Y.TZC.Api.fetchList().then((zones) => {
      const items = zones.map((name) => ({ name, selected: false }));
      console.log(items);
      timeZones.add(items);
      timeZones.save();
    });
  });
});
