const serializeEntity = (type, resolver) => (root, args, ctx) => {
  const { name: typeName } = type;
  const { serializers } = ctx;

  return resolver(root, args, ctx).then(serializers[typeName]);
};

export default serializeEntity;
