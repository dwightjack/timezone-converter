YUI.add(
  'tzc.models.appState',
  (Y) => {
    const Models = Y.namespace('TZC.Models');

    Models.AppState = Y.Base.create(
      'appState',
      Y.Model,
      [],
      {
        root: 'appState',
        initializer() {
          Y.Global.after('app:load', this.updateQueue, this);
          this.after('statusChange', ({ newVal }) => {
            Y.Global.fire('app:status', newVal);
          });
          this.after('change', ({ changed }) => {
            Y.Object.each(changed, ({ newVal }, key) => {
              Y.Global.fire(`app:${key}`, newVal);
            });
          });
        },
        updateQueue(bump) {
          const q = Math.min(0, (this.get('loadQueue') || 0) + (bump ? 1 : -1));
          this.setAttrs({
            loadQueue: q,
            status: q > 0 ? 'loading' : 'loaded',
          });
        },
        ready() {
          this.set('ready', true);
        },
      },
      {
        ATTRS: {
          loadQueue: null,
          status: 'idle',
          ready: false,
        },
      },
    );
  },
  __APP_VERSION__,
  { requires: ['app'] },
);
