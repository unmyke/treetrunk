const resolveContainer = (container) => {
  if (Array.isArray(container)) return container.map(resolveContainer);

  return (typeof container.$list === 'function'
    ? container.$list()
    : []
  ).reduce(
    (prevItems, itemName) => ({
      ...prevItems,
      [itemName]: container[itemName],
    }),
    {}
  );
};
export default resolveContainer;
