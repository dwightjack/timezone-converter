YUI.add(
  'tzc.cache',
  (Y) => {
    const TZC = Y.namespace('TZC');

    TZC.Cache = {
      set(key, value) {
        try {
          if (typeof value === 'function') {
            value = value(this.get(key));
          }
          localStorage.setItem(key, Y.JSON.stringify(value));
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
