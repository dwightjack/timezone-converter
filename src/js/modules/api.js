YUI.add(
  'tzc.api',
  (Y) => {
    const Api = Y.namespace('TZC.Api');

    const tzListSource = new Y.DataSource.IO({
      source: '/api/tzlist',
      resultListLocator: 'results',
    });

    tzListSource.plug({
      fn: Y.Plugin.DataSourceJSONSchema,
      cfg: {
        schema: {
          resultListLocator: 'zones',
        },
      },
    });

    // LocalStorage cache
    tzListSource.plug(Y.Plugin.DataSourceCache, {
      cache: Y.CacheOffline,
      sandbox: 'tzapi',
      expires: 86400000 * 14, // 14 days
    });

    Y.mix(Api, {
      /**
       * @return {Promise<string[]>}
       */
      fetchList() {
        Y.Global.fire('app:load', true);
        return new Y.Promise((resolve, reject) => {
          function success({ response }) {
            try {
              Y.Array.each(response.results, (item) => {
                item.label = item.name.replace(/_/g, ' ');
              });
              resolve(response.results);
            } catch (error) {
              reject(error);
            } finally {
              Y.Global.fire('app:load', false);
            }
          }
          function failure({ error }) {
            reject(error);
            Y.Global.fire('app:load', false);
          }

          tzListSource.sendRequest({
            on: {
              success,
              failure,
            },
          });
        });
      },
    });
  },
  '1.0.0',
  { requires: ['datasource', 'dataschema', 'promise', 'cache'] },
);
