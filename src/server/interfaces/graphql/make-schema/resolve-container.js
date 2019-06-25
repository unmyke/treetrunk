const resolveContainer = (container) =>
  (typeof container.$list === 'function' ? container.$list() : []).reduce(
    (prevItems, itemName) => ({
      ...prevItems,
      [itemName]: container[itemName],
    }),
    {}
  );
export default resolveContainer;
