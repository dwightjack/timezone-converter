YUI.add(
  'tzc.views.select',
  (Y) => {
    const Views = Y.namespace('TZC.Views');

    Views.Select = Y.Base.create('selectView', Y.View, [], {
      initializer() {
        if (!this.get('zoneList')) {
          throw new Error('Timezones model list not defined!');
        }
        this.get('container').on('submit', this.selectZone, this);
        this.get('zoneList').after('reset', this.renderSelect, this);
        this.get('zoneList').after('select', this.toggleSelectOption, this);
      },

      selectZone(e) {
        e.preventDefault();
        const timezone = Y.one('#tz-name').get('value');
        this.get('zoneList').toggleSelected(timezone, true);
        Y.one('#tz-name').set('value', '');
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
        const $nodes = Y.Array.map(models, (zone) => {
          return Y.Node.create(
            `<option value="${zone.get('label')}" data-id="${zone.get(
              'id',
            )}" />`,
          ).set('disabled', zone.get('selected'));
        });

        const $list = new Y.NodeList($nodes);

        Y.one('#timezone-data').append($list.toFrag());
      },
    });
  },
  '1.0.0',
  {
    requires: ['app'],
  },
);
