export default (serializer) => ({ entities, hasBefore, hasAfter }) => {
  const edges = entities.map((entity) => serializer(entity));
  edges.__type = `${serializer.name}Edge`;
  return {
    __type: `${serializer.name}Connection`,
    edges,
    pageInfo: {
      PreviousPage: hasBefore,
      hasNextPage: hasAfter,
      count: edges.length,
    },
  };
};
