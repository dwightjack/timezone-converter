YUI.add(
  'tzc.models.timeZoneList',
  (Y) => {
    const Models = Y.namespace('TZC.Models');

    Models.TimeZone = Y.Base.create(
      'timeZone',
      Y.Model,
      [],
      { root: 'timeZones' },
      {
        ATTRS: {
          id: {
            readOnly: true,
            getter() {
              return this.get('name').toLowerCase().replace(/\W/, '-');
            },
          },
          label: { value: '' },
          name: { value: '' },
          selected: { value: false },
        },
      },
    );

    Models.TimeZoneList = Y.Base.create('timeZoneList', Y.ModelList, [], {
      model: Models.TimeZone,
      initializer() {
        this.after('timeZone:selectedChange', ({ target }) =>
          this.fire('select', target.toJSON()),
        );
      },
      getUnselected() {
        return this.filter((model) => !model.get('selected'));
      },
      toggleSelected(label, toggle) {
        const labels = this.get('label');
        if (!labels.includes(label)) {
          alert(`Timezone ${label} is invalid`);
          return;
        }
        this.some((model) => {
          if (model.get('label') === label) {
            model.set(
              'selected',
              toggle !== undefined ? toggle : !this.get('selected'),
            );
          }
        });
      },
    });
  },
  '1.0.0',
  { requires: ['app'] },
);
