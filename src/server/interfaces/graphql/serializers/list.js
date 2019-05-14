export default (serializer) => ({ entities, hasBefore, hasAfter }) => {
  const edges = entities.map((entity) => serializer(entity));
  edges.__type = `${serializer.name}Edge`;
  return {
    __type: `${serializer.name}Connection`,
    edges,
    pageInfo: {
      hasBefore,
      hasAfter,
      count: edges.length,
    },
  };
};
