YUI.add(
  'mydemo-views-user',
  (Y) => {
    const Views = Y.namespace('MyDemo.Views');

    Views.User = Y.Base.create('userView', Y.View, [], {
      containerTemplate: '<li />',
      template: Y.Template.Micro.compile(Y.one('#user-tmpl').getHTML()),

      initializer() {
        const model = this.get('model');

        model.after('change', this.render, this);

        model.after(
          'destroy',
          function () {
            this.destroy({ remove: true });
          },
          this,
        );
      },

      render() {
        const container = this.get('container');
        const data = this.get('model').toJSON();
        container.set('data-id', data.id).setHTML(this.template(data));
        return this;
      },
    });
  },
  '1.0.0',
  { requires: ['view', 'template-micro'] },
);
