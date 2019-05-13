const serializeEntity = (type, resolver) => (root, args, ctx) => {
  const { name: typeName } = type;
  const { serializers } = ctx;

  return resolver(root, args, ctx).then(
    ({ entities, hasBefore, hasAfter }) => ({
      entities: entities.map(serializers[typeName]),
      hasBefore,
      hasAfter,
    })
  );
};

export default serializeEntity;
