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
        setDatetime(day) {
          const datetime = this.get('datetime');
          if (datetime && datetime.isSame(day, 'm')) {
            return;
          }
          const newDatetime = day.tz(this.get('name'));
          // change event fires a re-render
          // but we want to avoid that because input fields will loose focus
          // so instead we fire a custom event
          this.set('datetime', newDatetime, { silent: true });
          this.fire('datetimeUpdate', newDatetime);
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
          name: { value: '' },
          label: { value: '' },
          abbreviation: { value: '' },
          offset: { value: 0 },
          datetime: { value: null },
          dayPart: {
            readOnly: true,
            getter() {
              const datetime = this.get('datetime');
              if (!datetime) {
                return '';
              }
              const time = parseInt(datetime.format('H'), 10);
              if (time > 6 && time <= 10) {
                return 'morning';
              }
              if (time > 10 && time <= 18) {
                return 'daytime';
              }
              if (time > 18 && time <= 21) {
                return 'evening';
              }
              return 'night';
            },
          },
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

          this.after('remove', () => {
            if (this.size() === 0) {
              this.set('referenceDatetime', null, { silent: true });
            }
          });

          this.after('referenceDatetimeChange', ({ newVal }) => {
            this.invoke('setDatetime', newVal);
          });
        },
        setDateTime(value, tz) {
          const day = Y.TZC.Day.tz(value, tz).utc();
          this.set('referenceDatetime', day);
        },
      },
      {
        ATTRS: {
          referenceDatetime: { value: null },
        },
      },
    );
  },
  '1.0.0',
  { requires: ['app', 'tzc.day'] },
);
