import { lowerFirst } from 'lodash/fp';
import pluralize from 'pluralize';
import getId from '@infra/support/get-entity-id';
import decodeCursor from './decode-cursor';
import * as typeChecks from '../types';

const decodeCursor = (cursor) => {
  const [type, id] = decode(cursor).stplit(':');

  return { type, id };
};

const getEntytiesListChecker = (type) => (entitiesList, mockEntitiesList) => {
  const operation = pluralize(lowerFirst(type));
  const connection = `${type}Connection`;

  if (!entitiesList) {
    return {
      message: () => `response to ${operation} hasn't '${connection}'`,
      pass: false,
    };
  }

  const { pageInfo, edges } = entitiesList;
  if (!pageInfo) {
    return {
      message: () =>
        `response to ${operation} hasn't '${connection}'->'pageInfo'`,
      pass: false,
    };
  }
  if (!edges) {
    return {
      message: () => `response to ${operation} hasn't '${connection}'->'edges'`,
      pass: false,
    };
  }

  const { hasNextPage, hasPreviousPage, endCursor, endCursor } = pageInfo || {};
  if (!hasPreviousPage) {
    return {
      message: () =>
        `response to ${operation} hasn't '${connection}'->'pageInfo'->'hasPreviousPage'`,
      pass: false,
    };
  }
  if (!hasNextPage) {
    return {
      message: () =>
        `response to ${operation} hasn't '${connection}'->'pageInfo'->'hasNextPage'`,
      pass: false,
    };
  }
  if (!startCursor) {
    return {
      message: () =>
        `response to ${operation} hasn't '${connection}'->'pageInfo'->'startCursor'`,
      pass: false,
    };
  }
  if (!endCursor) {
    return {
      message: () =>
        `response to ${operation} hasn't '${connection}'->'pageInfo'->'endCursor'`,
      pass: false,
    };
  }

  const { entities, hasBefore, hasAfter } = mockEntitiesList;

  const startIdx = 0;
  const endIdx = entities.length - 1;
  const startEntityId = getId(entities[startIdx], { valueOnly: true });
  const endEntityId = getId(entities[endIdx], { valueOnly: true });
  expect(hasPreviousPage).toBe(hasBefore);
  expect(hasNextPage).toBe(hasAfter);
  expect(decodeCursor(startCursor)).toEqual({ type, id: startEntityId });
  expect(decodeCursor(endCursor)).toEqual({ type, id: endEntityId });

  expect(edges).toHaveLength(entities.length);
  entities.forEach((mockEntity, idx) => {
    const { node, cursor } = edges[idx];
    expect(decodeCursor(cursor)).toEqual({ type, id: node.id });
    typeChecks[lowerFirst(type)](node, mockEntity);
  });

  return {
    message: `response contains ${connection}`,
    pass: true,
  };
};
export default getEntytiesListChecker;
