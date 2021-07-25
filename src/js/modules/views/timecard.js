YUI.add(
  'tzc.views.timeCard',
  (Y) => {
    const Views = Y.namespace('TZC.Views');

    Views.TimeCard = Y.Base.create('timeCardView', Y.View, [], {
      containerTemplate: '<div class="c-tile" />',
      template: Y.Template.Micro.compile(Y.one('#timezone-tmpl').getHTML()),

      events: {
        '.c-timecard__close': { click: 'remove' },
        '.c-timecard__fieldset input': { change: 'updateDateTime' },
      },
      initializer() {
        const model = this.get('model');

        model.after('change', this.render, this);

        model.after(
          'destroy',
          function () {
            this.destroy({ remove: true });
          },
          this,
        );
      },

      render() {
        const data = this.get('model').toJSON();
        const $container = this.get('container');
        $container.setHTML(this.template(data));
        return this;
      },

      updateDateTime() {
        const $container = this.get('container');
        const date = $container.one('input[type="date"]').get('value');
        const time = $container.one('input[type="time"]').get('value');
        this.get('list').setDateTime(
          `${date}T${time}:00`,
          this.get('model').get('name'),
        );
      },

      remove() {
        this.get('model').destroy();
      },
    });
  },
  __APP_VERSION__,
  {
    requires: ['app', 'template-micro'],
  },
);
