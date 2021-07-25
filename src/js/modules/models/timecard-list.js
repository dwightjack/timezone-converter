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
        setDatetime(day) {
          this.set('datetime', day.tz(this.get('name')));
          console.log(this.get('datetime').format());
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
          datetime: null,
          dateStrings: {
            readOnly: true,
            getter() {
              const datetime = this.get('datetime');
              if (!datetime) {
                return {};
              }
              return {
                date: datetime.format('YYYY-MM-DD'),
                time: datetime.format('HH:mm'),
              };
            },
          },
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
        initializer() {
          this.after('add', ({ model }) => {
            if (!this.get('referenceDatetime')) {
              this.set('referenceDatetime', Y.TZC.Day().utc());
            }
            model.setDatetime(this.get('referenceDatetime'));
          });

          this.after('referenceDatetime:change', (e) => {
            console.log(e);
          });
        },
        setDateTime(value, tz) {
          const day = Y.TZC.Day.tz(value, tz).utc();
          this.set('referenceDatetime', day);
        },
      },
      {
        ATTRS: {
          referenceDatetime: null,
        },
      },
    );
  },
  __APP_VERSION__,
  { requires: ['app', 'tzc.day'] },
);
