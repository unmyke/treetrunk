const timestamp = (mapper) => (model) => ({
  ...mapper(model),
  createdAt: model.createdAt,
  updatedAt: model.updatedAt,
  deletedAt: model.deletedAt,
});

export default timestamp;
