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

          this.after('change', ({ changed }) => {
            Y.Object.each(changed, ({ newVal, prevVal }, key) => {
              Y.Global.fire(`app:${key}`, newVal, prevVal);
            });
          });
        },
        updateQueue(bump) {
          const q = Math.max(0, this.get('loadQueue') + (bump ? 1 : -1));
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
          loadQueue: { value: 0 },
          status: { value: 'idle' },
          ready: { value: false },
        },
      },
    );
  },
  '1.0.0',
  { requires: ['app'] },
);
