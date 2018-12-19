export const getIdPropName = (idObj) =>
  Object.keys(idObj).find((idName) => idName.slice(-2) === 'Id');

export const getId = (idObj) => idObj[getIdPropName()];
