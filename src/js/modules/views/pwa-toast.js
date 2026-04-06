YUI.add(
  'tzc.views.pwaToast',
  (Y) => {
    const Views = Y.namespace('TZC.Views');

    Views.PwaToast = Y.Base.create('pwaToastView', Y.View, [], {
      template: Y.Template.Micro.compile(Y.one('#toast-update-tmpl').getHTML()),
      events: {
        '.c-toast__confirm': { click: 'confirm' },
        '.c-toast__close': { click: 'hide' },
      },
      initializer() {
        Y.on('app:updateReady', this.show, this);
      },

      destructor() {
        Y.detach('app:updateReady', this.show, this);
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
        Y.fire('app:updateForce');
        this.hide();
      },

      show() {
        this.toggle(true);
      },

      hide() {
        this.toggle(false);
      },
    });
  },
  '1.0.0',
  {
    requires: ['app', 'template-micro'],
  },
);
