YUI.add(
  'links',
  (Y) => {
    const Links = Y.namespace('Links');

    Links.Clicker = Y.Base.create('cliker', Y.Base, [], {
      initializer() {
        this.$el = Y.Node.create('<div />');
        this.render();

        this.$el.delegate(
          'click',
          (ev) => {
            ev.preventDefault();
            this.fire('msg', {
              message: ev.currentTarget.getData('msg'),
            });
          },
          'button',
        );

        this.on('msg', ({ message }) => {
          Y.log(message);
        });
      },
      render() {
        for (let i = 0; i < 10; i++) {
          this.$el.append(
            Y.Node.create(
              `<button data-msg="clicked ${i}">Button ${i}</button>`,
            ),
          );
        }
      },
    });
  },
  '1.0.0',
  { requires: ['node-base', 'node-event-delegate', 'base-build'] },
);
