export const getIdPropNameByEntity = (root) =>
  root[`${root.constructor.name.toLowerCase()}Id`];
