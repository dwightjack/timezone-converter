YUI.add(
  'tzc.models.timezones',
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

    Models.TimezoneList = Y.Base.create(
      'timezoneList',
      Y.Model,
      [Y.ModelSync.Local],
      { model: Models.Timezone },
    );
  },
  __APP_VERSION__,
  { requires: ['model'] },
);
