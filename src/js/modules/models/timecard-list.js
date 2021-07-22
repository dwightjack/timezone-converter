YUI.add(
  'tzc.models.timeCardList',
  (Y) => {
    const Models = Y.namespace('TZC.Models');

    Models.TimeCard = Y.Base.create(
      'timeCard',
      Y.Model,
      [],
      {
        root: 'timeCards',
        getDaySection() {
          const time = parseInt(this.get('time').slice(0, 2), 10);
          if (time > 6 && time <= 10) {
            return 'morning';
          }
          if (time > 10 && time <= 17) {
            return 'daytime';
          }
          if (time > 18 && time <= 21) {
            return 'evening';
          }
          return 'night';
        },
      },
      {
        ATTRS: {
          id: {
            readOnly: true,
            getter() {
              return this.get('name').toLowerCase().replace(/\W/, '-');
            },
          },
          name: '',
          label: '',
          abbreviation: '',
          offset: 0,
        },
      },
    );

    Models.TimeCardList = Y.Base.create('timeCardList', Y.ModelList, [], {
      model: Models.TimeCard,
    });
  },
  __APP_VERSION__,
  { requires: ['app'] },
);
