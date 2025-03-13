YUI.add(
  'tzc.cache',
  (Y) => {
    const TZC = Y.namespace('TZC');

    TZC.Cache = {
      set(key, value) {
        try {
          const input =
            typeof value === 'function' ? value(this.get(key)) : value;
          localStorage.setItem(key, Y.JSON.stringify(input));
        } catch (e) {
          console.error(e);
          return false;
        }
        return true;
      },
      get(key) {
        try {
          const value = localStorage.getItem(key);
          return typeof value === 'string' ? Y.JSON.parse(value) : null;
        } catch (e) {
          console.error(e);
          return null;
        }
      },
    };
  },
  '1.0.0',
  { requires: ['json'] },
);
