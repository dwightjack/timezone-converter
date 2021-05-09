import hello from './modules/hello.js?url';

YUI({
  groups: {
    'local-modules': {
      modules: {
        hello: {
          fullpath: hello,
          requires: ['node-core'],
        },
      },
    },
  },
}).use('hello', 'node', 'transition', (Y) => {
  Y.Hello.hello();

  const $list = Y.one('#list');

  if ($list) {
    const $num = Y.Node.create('<b />');

    $list.all('li').each(($el, i) => {
      $el.append($num.cloneNode().set('text', i));
    });
  }

  Y.Transition.fx.fadeSlideIn = {
    opacity: 1,
    duration: 0.5,
    transform: 'translateY(0)',
    left: {
      value: 0,
      duration: 0.5,
      delay: 0.5,
    },
  };

  Y.Transition.fx.fadeSlideOut = {
    left: {
      value: '10px',
      delay: 0,
      duration: 0.5,
    },
    opacity: 0,
    delay: 0.5,
    transform: 'translateY(100px)',
  };

  Y.Transition.HIDE_TRANSITION = 'fadeSlideOut';
  Y.Transition.SHOW_TRANSITION = 'fadeSlideIn';

  Y.one('#btn').on('click', () => {
    const $box = Y.one('#box');
    if ($box.get('hidden')) {
      $box.show(true);
      return;
    }
    $box.hide(true);
  });

  const $p = Y.Node.create('<p />');
  const $container = Y.one('#container');

  function addNodes(num) {
    const $nodes = new Y.NodeList();
    for (let i = 0; i < num; i++) {
      $nodes.push($p.cloneNode().set('text', Y.guid()));
    }
    $container.append($nodes);
  }

  addNodes(10);

  $container.on('scroll', () => {
    if ($container.one('> p:last-child').inRegion($container)) {
      console.log('here');
      addNodes(10);
    }
  });
});
