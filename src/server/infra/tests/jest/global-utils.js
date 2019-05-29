export const getGlobal = (globalItem) => ({ name, callback }) => {
  globalItem(
    name,
    Array.isArray(callback)
      ? () => {
          callback.forEach((cb) => {
            cb();
          });
        }
      : callback
  );
};

export const getGlobals = (globalItem) => (items, config) => {
  const gItem = getGlobal(globalItem);
  Object.entries(items).forEach(([name, callback]) =>
    gItem({
      name,
      callback: callback(config),
    })
  );
};
