YUI.add(
  'tzc.views.pwaToast',
  (Y) => {
    const Views = Y.namespace('TZC.Views');

    Views.PwaToast = Y.Base.create(
      'pwaToastView',
      Y.View,
      [],
      {
        template: Y.Template.Micro.compile(
          Y.one('#toast-update-tmpl').getHTML(),
        ),
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
          const $container = this.get('container');
          if (needsRefresh) {
            $container.setHTML(this.template()).addClass('c-toast--visible');
            return;
          }
          $container.empty().removeClass('c-toast--visible');
        },

        confirm() {
          this.updater?.();
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
    requires: ['app', 'template-micro'],
  },
);
