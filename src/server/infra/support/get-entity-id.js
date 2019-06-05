import getIdPropName from './get-id-prop-name';

const getEntityId = (entity, { valueOnly }) => {
  const idPropName = getIdPropName(entity);
  const entityId = entity[idPropName];

  if (!entityId) return undefined;
  if (valueOnly) return entityId.value;
  return entityId;
};
export default getEntityId;
