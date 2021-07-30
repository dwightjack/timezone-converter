YUI.add(
  'tzc.views.timeCard',
  (Y) => {
    const Views = Y.namespace('TZC.Views');

    const debounce = (callback, wait) => {
      let timeoutId = null;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          callback.apply(null, args);
        }, wait);
      };
    };

    Views.TimeCard = Y.Base.create('timeCardView', Y.View, [], {
      containerTemplate: '<div class="c-tile" />',
      template: Y.Template.Micro.compile(Y.one('#timezone-tmpl').getHTML()),

      events: {
        '.c-timecard__close': { click: 'close' },
        '.c-timecard__fieldset input': { change: 'updateDateTime' },
      },
      initializer() {
        const model = this.get('model');

        model.after('datetimeUpdate', this.updateFields, this);
        model.after(
          'datetimeUpdate',
          debounce(() => this.setDayPart(), 300),
        );

        model.after('destroy', () => {
          this.destroy({ remove: true });
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
          $container
            .removeAttribute('style')
            .one('.c-timecard__interval')
            .hide();
          return;
        }

        $container
          .setAttribute(
            'style',
            `--tile-color-background: var(--color-background-interval-${part})`,
          )
          .one('.c-timecard__interval')
          .show()
          .one('use')
          .setAttribute('xlink:href', `#icon-${part}`);
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
