YUI.add(
  'tzc.views.timeCardList',
  (Y) => {
    const Views = Y.namespace('TZC.Views');

    Views.TimeCardList = Y.Base.create('timeCardListView', Y.View, [], {
      initializer() {
        const cardList = this.get('cardList');

        cardList.after('add', this.add, this);
        cardList.after('reset', this.render, this);
      },

      add({ model }) {
        this.get('container').append(this.renderCard(model));
      },

      renderCard(card) {
        const cardView = new Y.TZC.Views.TimeCard({
          model: card,
          list: this.get('cardList'),
        });
        return cardView.render().get('container');
      },

      render() {
        const fragment = Y.one(Y.config.doc.createDocumentFragment());

        this.get('cardList').each((card) => {
          fragment.append(this.renderCard(card));
        });
        this.get('container').empty().append(fragment);
      },
    });
  },
  '1.0.0',
  { requires: ['view', 'tzc.views.timeCard'] },
);
