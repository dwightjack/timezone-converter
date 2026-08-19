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
          Y.after('app:load', this.updateQueue, this);

          this.after('change', ({ changed }) => {
            Y.Object.each(changed, ({ newVal, prevVal }, key) => {
              Y.fire(`app:${key}`, newVal, prevVal);
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
          loadQueue: { value: 0, validator: Y.Lang.isBoolean },
          status: {
            value: 'idle',
            validator: (v) => ['idle', 'loading', 'loaded'].includes(v),
          },
          ready: { value: false, validator: Y.Lang.isBoolean },
        },
      },
    );
  },
  '1.0.0',
  { requires: ['app'] },
);
