YUI.add(
  'tzc.views.app',
  (Y) => {
    const Views = Y.namespace('TZC.Views');

    Views.App = Y.Base.create('appView', Y.View, [], {
      events: {
        // '#tz-select': { submit: 'selectZone' },
      },
      selectZone(e) {
        e.preventDefault();
        const tz = Y.one('#city-name').get('value');
        this.get('timeZones').toggleSelected(tz, true);
        Y.one('#city-name').set('value', '');
      },
      initializer() {
        if (!this.get('timeZones')) {
          throw new Error('Timezones model list not defined!');
        }
        this.get('container').delegate('submit', this.selectZone, 'form', this);
        this.get('timeZones').after('reset', this.renderSelect, this);
        this.get('timeZones').after(
          'timeZone:selectedChange',
          this.toggleSelectOption,
          this,
        );
      },

      toggleSelectOption({ target }) {
        Y.one(`option[data-id="${target.get('id')}"]`).set(
          'disabled',
          target.get('selected'),
        );
      },

      render() {
        const models = this.get('timeZones').toArray();
        this.renderSelect({ models });
        return this;
      },

      renderSelect({ models }) {
        const $datalist = Y.one('#timezone-cities');

        models.forEach((zone) => {
          const $option = Y.Node.create(
            `<option value="${zone.getAsHTML('name')}" data-id="${zone.get(
              'id',
            )}">${zone.getAsHTML('label')}</option>`,
          );

          $option.set('disabled', zone.get('selected'));
          $datalist.append($option);
        });
      },
    });
  },
  __APP_VERSION__,
  {
    requires: ['app'],
  },
);
