const connections = (ctx) => {
  const { types, utils: getConnection } = ctx;

  return Object.entries(types).reduce((prevConnections, [typeName, type]) => ({
    ...prevConnections,
    [typeName]: getConnection(type),
  }));
};
export default connections;
