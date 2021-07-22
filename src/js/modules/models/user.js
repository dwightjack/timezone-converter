YUI.add(
  'mydemo-models-user',
  (Y) => {
    const Models = Y.namespace('MyDemo.Models');

    Models.User = Y.Base.create(
      'user',
      Y.Model,
      [],
      {},
      {
        ATTRS: {
          name: {},
          email: {},
        },
      },
    );
  },
  '1.0.0',
  { requires: ['model'] },
);
