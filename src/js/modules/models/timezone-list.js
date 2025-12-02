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
        this.cache = new Y.CacheOffline({
          expires: 0,
          max: 1,
          sandbox: 'Models.TimeZoneList',
        });
        /** emit whenever a timezone 'selected' attribute changes  */
        this.after('timeZone:selectedChange', ({ target }) =>
          this.fire('select', target.toJSON()),
        );
        this.after('timeZone:selectedChange', this.saveStore, this);
      },
      getUnselected() {
        return this.filter((model) => !model.get('selected'));
      },
      toggleSelected(label, toggle) {
        // list of all timezone labels
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
      saveStore({ newVal: isSelected, target: model }) {
        // I cannot just map over the modellist because
        // I will then lose the cards' order in the UI
        const currentZones = this.loadStore();
        const name = model.get('name');
        const updatedZones = isSelected
          ? Y.Array.unique([...currentZones, name])
          : Y.Array.filter(currentZones, (zone) => zone !== name);

        this.cache.add('selected', updatedZones);
      },
      loadStore() {
        return this.cache.retrieve('selected')?.response ?? [];
      },
    });
  },
  '1.0.0',
  { requires: ['app'] },
);
