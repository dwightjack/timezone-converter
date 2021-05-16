YUI.add(
  'links',
  (Y) => {
    const Links = Y.namespace('Links');

    Links.Clicker = Y.Base.create(
      'clicker',
      Y.Widget,
      [],
      {
        initializer() {
          this.$listeners = [];
        },
        destructor() {
          let handler;
          while ((handler = this.$listeners.pop())) {
            handler();
          }
          this.get('contentBox').all('button, p').remove(true);
        },
        bindUI() {
          const unbindDelegate = this.get('contentBox').delegate(
            'click',
            (ev) => {
              ev.preventDefault();
              this.set('msg', ev.currentTarget.getData('msg'));
            },
            'button',
          );
          this.$listeners.push(unbindDelegate);
          this.after('msgChange', this.syncUI, this);
        },
        renderUI() {
          const $list = new Y.NodeList();
          const $msgBox = Y.Node.create('<p></p>');
          for (let i = 0; i < 10; i++) {
            $list.push(
              Y.Node.create(
                `<button data-msg="clicked ${i}">Button ${i}</button>`,
              ),
            );
          }

          this._set('msgBox', $msgBox);

          this.get('contentBox').append($msgBox).append($list);
        },
        syncUI() {
          this.get('msgBox').set('text', this.get('msg'));
        },
      },
      {
        ATTRS: {
          msgBox: {
            readOnly: true,
          },
          msg: {
            value: '...',
            broadcast: 2,
          },
        },
      },
    );
  },
  '1.0.0',
  { requires: ['base-build', 'widget'] },
);
