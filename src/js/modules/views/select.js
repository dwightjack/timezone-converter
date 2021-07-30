YUI.add(
  'tzc.views.select',
  (Y) => {
    const Views = Y.namespace('TZC.Views');

    Views.Select = Y.Base.create('selectView', Y.View, [], {
      selectZone(e) {
        e.preventDefault();
        const timezone = Y.one('#tz-name').get('value');
        this.get('zoneList').toggleSelected(timezone, true);
        Y.one('#tz-name').set('value', '');
      },
      initializer() {
        if (!this.get('zoneList')) {
          throw new Error('Timezones model list not defined!');
        }
        this.get('container').on('submit', this.selectZone, this);
        this.get('zoneList').after('reset', this.renderSelect, this);
        this.get('zoneList').after('select', this.toggleSelectOption, this);
      },

      toggleSelectOption({ id, selected }) {
        const $option = Y.one(`option[data-id="${id}"]`);
        $option && $option.set('disabled', selected);
      },

      render() {
        const models = this.get('zoneList').toArray();
        this.renderSelect({ models });
        return this;
      },

      renderSelect({ models }) {
        const $datalist = Y.one('#timezone-data');

        models.forEach((zone) => {
          const $option = Y.Node.create(
            `<option value="${zone.get('label')}" data-id="${zone.get(
              'id',
            )}" />`,
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
