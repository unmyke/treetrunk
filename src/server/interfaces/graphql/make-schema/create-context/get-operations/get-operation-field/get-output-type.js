import { crudPredicates } from '@common';

const { isListGetter } = crudPredicates;

const getOperationName = ({ type, crudName }) => {
  const { name: typeName } = type;

  switch (true) {
    case isListGetter(crudName):
      return `${typeName}Connection`;
    default:
      return type;
  }
};

export default getOperationName;
