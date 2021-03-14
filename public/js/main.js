YUI({
  groups: {
    'local-modules': {
      base: '/js/modules/',
      modules: {
        hello: {
          path: 'hello.js',
          requires: ['node-core'],
        },
      },
    },
  },
}).use('hello', (Y) => {
  Y.Hello.hello();
});
