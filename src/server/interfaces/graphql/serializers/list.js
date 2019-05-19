import { lowerFirst } from 'lodash';

const getListSerializer = (serializer) => ({
  entities,
  hasBefore,
  hasAfter,
}) => {
  const edges = entities.map((entity) => {
    const cursor = {
      typeName: entity.constructor.name,
      id: entity[`${lowerFirst(entity.constructor.name)}Id`],
    };
    const node = serializer(entity);
    return { cursor, node };
  });

  edges.__type = `${serializer.name}Edge`;
  return {
    __type: `${serializer.name}Connection`,
    edges,
    pageInfo: {
      hasPreviousPage: hasBefore,
      hasNextPage: hasAfter,
      count: edges.length,
    },
  };
};

export default getListSerializer;
