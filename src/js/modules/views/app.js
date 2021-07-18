YUI.add(
  'tzc.views.app',
  (Y) => {
    const Views = Y.namespace('TZC.Views');

    Views.App = Y.Base.create('appView', Y.View, [], {
      events: {
        '#tz-select button': { click: 'selectZone' },
      },
      selectZone(e) {
        e.preventDefault();
        const tz = this.get('container').one('#city-name').get('value');
        this.get('timeZones').setSelected(tz);
        this.get('container').one('#city-name').set('value', '');
      },
      initializer() {
        if (!this.get('timeZones')) {
          throw new Error('Timezones model list not defined!');
        }
        this.get('timeZones').after('reset', this.renderSelect, this);
        this.get('timeZones').after(
          'timezone:selectedChange',
          this.toggleSelectOption,
          this,
        );
      },

      toggleSelectOption({ model }) {
        console.log(model);
      },

      render() {
        const models = this.get('timeZones').toArray();
        this.renderSelect({ models });
        return this;
      },

      renderSelect({ models }) {
        models.forEach((zone) => {
          const $container = this.get('container');
          const $datalist = $container.one('#timezone-cities');
          $datalist.append(
            Y.Node.create(
              `<option value="${zone.getAsHTML(
                'name',
              )}" data-id="${zone.getAsHTML('id')}" />`,
            ),
          );
        });
      },
    });
  },
  __APP_VERSION__,
  {
    requires: ['app'],
  },
);
