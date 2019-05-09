import dateTimeSerializer from './date-time';

export default (serializer) => (entity) => ({
  ...serializer(entity),
  createdAt: dateTimeSerializer(entity.createdAt),
  updatedAt: dateTimeSerializer(entity.updatedAt),
  deletedAt: dateTimeSerializer(entity.deletedAt),
});
