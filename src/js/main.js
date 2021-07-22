import hello from './modules/hello.js?url';
import links from './modules/links.js?url';
import users from './modules/users.js?url';
import modelsUser from './modules/models/user.js?url';
import modelsUserList from './modules/models/user-list.js?url';
import viewsUser from './modules/views/user.js?url';
import viewsUserList from './modules/views/user-list.js?url';

YUI({
  modules: {
    hello: {
      fullpath: hello,
      requires: ['node-base'],
    },
    links: {
      fullpath: links,
      requires: ['node-base', 'node-event-delegate', 'base-build'],
    },
    users: {
      fullpath: users,
      requires: ['io-base', 'json-parse'],
    },
    'mydemo-models-user': {
      fullpath: modelsUser,
      requires: ['model'],
    },
    'mydemo-models-userlist': {
      fullpath: modelsUserList,
      requires: ['model-list', 'mydemo-models-user'],
    },
    'mydemo-views-user': {
      fullpath: viewsUser,
      requires: ['view', 'template-micro'],
    },
    'mydemo-views-userlist': {
      fullpath: viewsUserList,
      requires: ['view', 'mydemo-views-user'],
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
      addNodes(10);
    }
  });

  // Y.use('links', () => {
  //   const clicker = new Y.Links.Clicker();

  //   Y.on('clicker:msgChange', ({ newVal }) => {
  //     Y.log(newVal);
  //   });

  //   clicker.render('#clicker');
  // });

  Y.use(
    'users',
    'mydemo-models-user',
    'mydemo-models-userlist',
    'mydemo-views-userlist',
    () => {
      const userList = new Y.MyDemo.Models.UserList();
      const userListView = new Y.MyDemo.Views.UserList({
        list: userList,
      });
      Y.one('#user-list').append(userListView.get('container'));
      Y.Users.fetch((data) => {
        const models = data.map(({ id, name, email }) => ({ id, name, email }));
        userList.add(models);
      });
    },
  );
});
