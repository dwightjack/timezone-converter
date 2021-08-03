YUI.add(
  'tzc.views.pwaToast',
  (Y) => {
    const Views = Y.namespace('TZC.Views');

    Views.PwaToast = Y.Base.create(
      'pwaToastView',
      Y.View,
      [],
      {
        events: {
          '.c-toast__confirm': { click: 'confirm' },
          '.c-toast__close': { click: 'close' },
        },
        initializer() {
          const registerSW = this.get('registerSW');
          if (typeof registerSW === 'function') {
            this.updater = registerSW({
              immediate: true,
              onNeedRefresh: () => {
                this.toggle(true);
              },
            });
          }
        },

        render() {
          return this;
        },

        toggle(needsRefresh) {
          this.get('container').toggleClass('c-toast--visible', !!needsRefresh);
        },

        confirm() {
          this.updater && this.updater();
          this.close();
        },

        close() {
          this.toggle(false);
        },
      },
      {
        ATTRS: {
          registerSW: { value: null },
        },
      },
    );
  },
  '1.0.0',
  {
    requires: ['app'],
  },
);
