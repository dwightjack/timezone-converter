YUI.add(
  'mydemo-views-userlist',
  (Y) => {
    const Views = Y.namespace('MyDemo.Views');

    Views.UserList = Y.Base.create(
      'userListView',
      Y.View,
      [],
      {
        containerTemplate: '<ul />',

        initializer() {
          const list = this.get('list');

          list.after('add', this.add, this);
          list.after('reset', this.render, this);
        },

        add({ model }) {
          this.get('container').append(this.renderModel(model));
        },

        renderModel(model) {
          const userView = new Y.MyDemo.Views.User({ model });
          return userView.render().get('container');
        },

        render() {
          const fragment = Y.one(Y.config.doc.createDocumentFragment());

          this.get('list').each((model) => {
            fragment.append(this.renderModel(model));
          });
          this.get('container').empty().append(fragment);
        },
      },
      {
        ATTRS: {
          list: {},
        },
      },
    );
  },
  '1.0.0',
  { requires: ['view', 'mydemo-views-user'] },
);
