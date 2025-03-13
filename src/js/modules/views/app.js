YUI.add(
  'tzc.views.app',
  (Y) => {
    const Views = Y.namespace('TZC.Views');

    Views.App = Y.Base.create('appView', Y.View, [], {
      initializer() {
        // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
        const zoneList = (this.zoneList = new Y.TZC.Models.TimeZoneList({
          items: this.getZoneItems(),
        }));
        // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
        const cardList = (this.cardList = new Y.TZC.Models.TimeCardList());

        this.cardListView = new Views.TimeCardList({
          cardList,
          container: Y.one('#timecard-list'),
        });

        this.selectView = new Views.Select({
          container: Y.one('#tz-select'),
          zoneList,
        });

        Y.Global.after(['app:status', 'app:ready'], this.toggleBusy, this);

        zoneList.after('select', ({ name, selected }) => {
          if (selected) {
            this.addCard(name);
            Y.TZC.Cache.set('tzselect', (zones) => {
              return Y.Array.unique((zones || []).concat(name));
            });
            return;
          }
          Y.TZC.Cache.set('tzselect', (zones) => {
            return Y.Array.filter(zones || [], (zone) => zone !== name);
          });
        });

        cardList.after('remove', ({ model }) => {
          zoneList.toggleSelected(model.get('label'), false);
        });
        cardList.after('add', ({ model }) => {
          zoneList.toggleSelected(model.get('label'), true);
        });

        this.onceAfter('rendered', () => {
          // look for cached timezones
          const cached = Y.TZC.Cache.get('tzselect');

          if (Y.Lang.isArray(cached) && cached.length > 0) {
            Y.Array.each(cached, (tz) => this.addCard(tz));
            return;
          }
          const currentTz = Y.TZC.Day.tz.guess();
          if (currentTz) {
            this.addCard(currentTz);
          }
        });
      },

      render() {
        this.selectView.render();
        this.cardListView.render();
        this.fire('rendered');
        return this;
      },

      toggleBusy(status) {
        const $container = this.get('container');
        if (status === 'loading') {
          $container.setAttribute('aria-busy', true);
          return;
        }
        $container.removeAttribute('aria-busy');
      },

      getZoneItems() {
        return Y.Array.map(this.get('zonesDB'), ({ label, name }) => ({
          label,
          name,
        }));
      },

      addCard(timezone) {
        const zoneData = Y.Array.find(this.get('zonesDB'), (zone) => {
          return zone.name === timezone;
        });
        if (!zoneData) {
          alert(`Unable to find details for timezone "${timezone}"`);
          return;
        }

        const { currentTimeOffsetInMinutes, name, abbreviation } = zoneData;

        this.cardList.add({
          name,
          label: name.replace(/_/g, ' '),
          abbreviation,
          offset: currentTimeOffsetInMinutes,
        });
      },
    });
  },
  '1.0.0',
  {
    requires: [
      'app',
      'tzc.day',
      'tzc.cache',
      'tzc.models.timeZoneList',
      'tzc.models.timeCardList',
      'tzc.views.select',
      'tzc.views.timeCardList',
    ],
  },
);
