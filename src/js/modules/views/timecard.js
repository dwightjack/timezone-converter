YUI.add(
  'tzc.views.timeCard',
  (Y) => {
    const Views = Y.namespace('TZC.Views');

    Views.TimeCard = Y.Base.create('timeCardView', Y.View, [], {
      containerTemplate: '<li class="c-tile" />',
      template: Y.Template.Micro.compile(Y.one('#timecard-tmpl').getHTML()),

      events: {
        '.c-timecard__close': { click: 'close' },
        '.c-timecard__fieldset input': { change: 'updateDateTime' },
      },
      initializer() {
        const model = this.get('model');

        model.after('datetimeUpdate', this.updateFields, this);
        model.after(
          'datetimeUpdate',
          Y.throttle(() => this.setDayPart(), 300),
        );

        model.after('destroy', () => {
          this.get('container').addClass('c-tile--out');
          Y.TZC.Utils.viewTransition(() => {
            this.destroy({ remove: true });
          });
        });
      },

      render() {
        const data = this.get('model').toJSON();
        const $container = this.get('container');
        $container.setHTML(this.template(data));
        this.setDayPart();
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
        const $container = this.get('container');
        const { date, time } = this.get('model').get('dateStrings');
        $container.one('input[type="date"]').set('value', date);
        $container.one('input[type="time"]').set('value', time);
      },

      setDayPart() {
        const $container = this.get('container');
        const part = this.get('model').get('dayPart');
        if (!part) {
          $container.removeAttribute('data-theme');
          return;
        }

        $container.setAttribute('data-theme', part);
      },

      close() {
        this.get('model').destroy();
      },
    });
  },
  '1.0.0',
  {
    requires: ['app', 'yui-throttle', 'template-micro', 'tzc.utils'],
  },
);
