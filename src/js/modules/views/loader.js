YUI.add(
  'tzc.views.loader',
  (Y) => {
    const Views = Y.namespace('TZC.Views');

    Views.Loader = Y.Base.create('loaderView', Y.View, [], {
      initializer() {
        Y.Global.after('app:status', this.toggle, this);
      },

      render() {
        return this;
      },

      toggle(status) {
        this.get('container').toggleClass(
          'c-loader--visible',
          status === 'loading',
        );
      },
    });
  },
  __APP_VERSION__,
  {
    requires: ['app'],
  },
);
