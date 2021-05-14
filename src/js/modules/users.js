YUI.add(
  'users',
  (Y) => {
    const Users = Y.namespace('Users');

    Y.mix(Users, {
      fetch(callback) {
        Y.io('https://jsonplaceholder.typicode.com/users', {
          on: {
            success(_id, { responseText }) {
              callback(Y.JSON.parse(responseText));
            },
          },
        });
      },
    });
  },
  '1.0.0',
  { requires: ['io-base', 'json-parse'] },
);
