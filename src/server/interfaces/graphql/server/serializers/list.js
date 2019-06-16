/* eslint-disable no-underscore-dangle */
import { lowerFirst } from 'lodash';

const getId = (entity) => entity[`${lowerFirst(entity.constructor.name)}Id`];

const getListSerializer = (serializer) => ({
  entities,
  hasBefore,
  hasAfter,
}) => {
  const edges = entities.map((entity) => {
    const cursor = {
      typeName: entity.constructor.name,
      id: getId(entity),
    };
    const node = serializer(entity);
    return { cursor, node };
  });
  const startItem = edges[0];
  const endItem = edges[edges.length - 1];
  const startCursor = startItem ? startItem.cursor : null;
  const endCursor = endItem ? endItem.cursor : null;

  edges.__type = `${serializer.name}Edge`;
  return {
    __type: `${serializer.name}Connection`,
    edges,
    pageInfo: {
      hasPreviousPage: hasBefore,
      hasNextPage: hasAfter,
      startCursor,
      endCursor,
    },
  };
};

export default getListSerializer;
