export default (serializer) => (entity) => ({
  ...serializer(entity),
  createdAt: entity.createdAt,
  updatedAt: entity.updatedAt,
  deletedAt: entity.deletedAt,
});
