YUI.add(
  'tzc.views.app',
  (Y) => {
    const Views = Y.namespace('TZC.Views');

    Views.App = Y.Base.create('appView', Y.View, [], {
      initializer() {
        const zoneList = (this.zoneList = new Y.TZC.Models.TimeZoneList({
          items: this.getZoneItems(),
        }));
        const cardList = (this.cardList = new Y.TZC.Models.TimeCardList());

        this.cardListView = new Views.TimeCardListView({
          cardList,
          container: Y.one('#timezone-list'),
        });

        this.selectView = new Views.Select({
          container: Y.one('#tz-select'),
          zoneList,
        });

        window.cardList = cardList;

        zoneList.after('select', ({ name }) => this.addCard(name));

        cardList.after('remove', ({ model }) => {
          zoneList.toggleSelected(model.get('label'), false);
        });
      },

      render() {
        this.selectView.render();
        this.cardListView.render();
        return this;
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
  __APP_VERSION__,
  {
    requires: [
      'app',
      'tzc.models.timeZoneList',
      'tzc.models.timeCardList',
      'tzc.views.select',
      'tzc.views.timeCardList',
    ],
  },
);
