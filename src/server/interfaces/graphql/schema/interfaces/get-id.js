export default (o) => {
  console.log(o);
  const idPropName = `${o.constructor.name.toLowerCase()}Id`;
  return o[idPropName];
};
