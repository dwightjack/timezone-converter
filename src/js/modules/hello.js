YUI.add(
  'hello',
  (Y) => {
    const Hello = Y.namespace('Hello');

    Y.mix(Hello, {
      hello: () => Y.one('#app').set('text', 'hello!'),
    });
  },
  '1.0.0',
  { requires: ['node-base'] },
);
