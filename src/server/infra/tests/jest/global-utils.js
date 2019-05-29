export const getGlobal = (globalItem) => ({ name, callback }) => {
  if (Array.isArray(callback)) {
    callback.forEach((cb) => {
      return globalItem(name, cb);
    });
  }
  return globalItem(name, callback);
};

export const getGlobals = (globalItem) => (items) => {
  const gItem = getGlobal(globalItem);
  return Object.entries(items).map(([name, callback]) =>
    gItem({
      name,
      callback,
    })
  );
};
