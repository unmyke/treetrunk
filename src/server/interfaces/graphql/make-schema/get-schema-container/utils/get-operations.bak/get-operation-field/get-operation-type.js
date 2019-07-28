import { crudPredicates } from '@common';

const { isGetter } = crudPredicates;

const getOperationType = (crudName) =>
  isGetter(crudName) ? 'Query' : 'Mutation';

export default getOperationType;
