import { queryType, mutationType } from 'nexus';

import getSchemaOperations from './get-schema-operations';

import node from './node';
// import * as Seller from './seller';
import * as Post from './post';
// import * as SeniorityType from './seniority-type';

const operations = { node };
const typesOperations = {
  // Seller,
  Post,
  // SeniorityType
};

const Query = queryType({
  definition() {},
});

const Mutation = mutationType({
  definition() {},
});

const getOperations = (ctx) => {
  const { getSchemaOperations } = ctx;
  return {
    Query,
    Mutation,
    ...getSchemaOperations({ operations, typesOperations }),
  };
};
export default getOperations;
