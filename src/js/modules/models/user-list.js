YUI.add(
  'mydemo-models-userlist',
  (Y) => {
    const Models = Y.namespace('MyDemo.Models');

    Models.UserList = Y.Base.create('userList', Y.ModelList, [], {
      model: Models.User,
    });
  },
  '1.0.0',
  { requires: ['model-list', 'mydemo-models-user'] },
);
