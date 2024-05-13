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
      containerTemplate: '<div class="c-tile"></div>',
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

        this.onceAfter('rendered', this.enter, this);

        model.after('destroy', () => {
          const $container = this.get('container');

          $container.setStyle('view-transition-name', 'tile-anim');

          document.startViewTransition(() => {
            $container.removeAttribute('style');
            this.destroy({ remove: true });
          });
        });
      },

      render() {
        const data = this.get('model').toJSON();
        const $container = this.get('container');

        this.setDayPart();

        $container.setStyle('view-transition', `tile-${data.id}`);
        $container.setHTML(this.template(data));

        // this.fire('rendered');
        return this;
      },

      appendTo($parent) {
        const $container = this.get('container');
        $container.setStyle('view-transition-name', 'tile-anim');
        const transition = document.startViewTransition(() => {
          $parent.append($container);
        });

        transition.finished.then(() => {
          $container.setStyle(
            'view-transition-name',
            `tile-${this.get('model').get('id')}`,
          );
        });
      },

      enter() {
        // const $container = this.get('container');
        // return Y.TZC.Utils.transition(() => {
        //   $container && $container.addClass('a-fade-grow--in');
        // }, 200).then(() => {
        //   $container && $container.removeClass('a-fade-grow a-fade-grow--in');
        // });
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
    requires: ['app', 'template-micro', 'tzc.utils', 'anim'],
  },
);
