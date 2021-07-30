YUI.add(
  'tzc.views.timeCard',
  (Y) => {
    const Views = Y.namespace('TZC.Views');

    Views.TimeCard = Y.Base.create('timeCardView', Y.View, [], {
      containerTemplate: '<div class="c-tile" />',
      template: Y.Template.Micro.compile(Y.one('#timezone-tmpl').getHTML()),

      events: {
        '.c-timecard__close': { click: 'close' },
        '.c-timecard__fieldset input': { change: 'updateDateTime' },
      },
      initializer() {
        const model = this.get('model');

        model.after('datetime', this.render, this);

        model.after('datetimeUpdate', this.updateFields, this);

        model.after('destroy', () => {
          this.destroy({ remove: true });
        });
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

      updateFields() {
        const { date, time } = this.get('model').get('dateStrings');
        const $container = this.get('container');
        $container.one('input[type="date"]').set('value', date);
        $container.one('input[type="time"]').set('value', time);
      },

      close() {
        this.get('model').destroy();
      },
    });
  },
  __APP_VERSION__,
  {
    requires: ['app', 'template-micro'],
  },
);
