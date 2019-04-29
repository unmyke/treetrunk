export default (o) => {
  const idPropName = `${o.constructor.name.toLowerCase()}Id`;
  return o[idPropName];
};
