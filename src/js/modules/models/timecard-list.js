YUI.add(
  'tzc.models.timeCardList',
  (Y) => {
    const Models = Y.namespace('TZC.Models');

    // function getDaySection() {
    //   const time = parseInt(this.get('time').slice(0, 2), 10);
    //   if (time > 6 && time <= 10) {
    //     return 'morning';
    //   }
    //   if (time > 10 && time <= 17) {
    //     return 'daytime';
    //   }
    //   if (time > 18 && time <= 21) {
    //     return 'evening';
    //   }
    //   return 'night';
    // }

    Models.TimeCard = Y.Base.create(
      'timeCard',
      Y.Model,
      [],
      {
        root: 'timeCards',
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
          offsetLabel: {
            readOnly: true,
            getter() {
              const offset = this.get('offset');
              if (offset === 0) {
                return '+00:00';
              }
              const hh = Math.abs(Math.trunc(offset / 60))
                .toString()
                .padStart(3, offset > 0 ? '+0' : '-0');
              const mm = Math.abs(offset % 60)
                .toString()
                .padStart(2, '0');
              return `${hh}:${mm}`;
            },
          },
        },
      },
    );

    Models.TimeCardList = Y.Base.create(
      'timeCardList',
      Y.ModelList,
      [],
      {
        model: Models.TimeCard,
      },
      {
        ATTRS: {
          datetime: {
            valueFn: () => new Date(),
          },
        },
      },
    );
  },
  __APP_VERSION__,
  { requires: ['app'] },
);
