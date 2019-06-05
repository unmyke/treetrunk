const checkEntityTimestamp = (entity, mockEntity) => {
  if (mockEntity.createdAt) {
    expect(entity.createdAt).toBe(mockEntity.createdAt.getTime());
  } else {
    expect(entity.createdAt).toBeNull();
  }
  if (mockEntity.updatedAt) {
    expect(entity.updatedAt).toBe(mockEntity.updatedAt.getTime());
  } else {
    expect(entity.updatedAt).toBeNull();
  }
  if (mockEntity.deletedAt) {
    expect(entity.deletedAt).toBe(mockEntity.deletedAt.getTime());
  } else {
    expect(entity.deletedAt).toBeNull();
  }
};
export default checkEntityTimestamp;
