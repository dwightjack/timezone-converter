YUI.add(
  'tzc.models.timezoneList',
  (Y) => {
    const Models = Y.namespace('TZC.Models');

    Models.Timezone = Y.Base.create(
      'timezone',
      Y.Model,
      [],
      { root: 'timezones' },
      {
        ATTRS: {
          name: '',
          selected: false,
        },
      },
    );

    Models.TimezoneList = Y.Base.create('timezoneList', Y.ModelList, [], {
      model: Models.Timezone,
      getUnselected() {
        return this.filter((model) => !model.get('selected'));
      },
      toggleSelected(name, toggle) {
        this.some((model) => {
          if (model.get('name') === name) {
            model.set(
              'selected',
              toggle !== undefined ? toggle : !this.get('selected'),
            );
          }
        });
      },
    });
  },
  __APP_VERSION__,
  { requires: ['app'] },
);
