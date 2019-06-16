import node from './node';
import * as seller from './seller';
import * as post from './post';
import * as seniorityType from './seniority-type';

const operations = { node, ...seller, ...post, ...seniorityType };

const getOperations = (ctx) =>
  Object.entries(operations).reduce(
    (prevOperation, [operationName, operation]) => ({
      ...prevOperation,
      [operationName]: operation(ctx),
    }),
    {}
  );
export default getOperations;
