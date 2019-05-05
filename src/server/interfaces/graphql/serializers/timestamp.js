import dateSerializer from './date';

export default (serializer) => (entity) => ({
  ...serializer(entity),
  createdAt: dateSerializer(entity.createdAt),
  updatedAt: dateSerializer(entity.updatedAt),
  deletedAt: dateSerializer(entity.deletedAt),
});
