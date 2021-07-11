YUI.add(
  'tzc.models.timezone',
  (Y) => {
    const Models = Y.namespace('TZC.Models');

    Models.Timezone = Y.Base.create(
      'timezone',
      Y.Model,
      [Y.ModelSync.Local],
      { root: 'timezones' },
      {
        ATTRS: {
          name: '',
          selected: false,
        },
      },
    );
  },
  __APP_VERSION__,
  { requires: ['model'] },
);
