import pluralize from 'pluralize';
import { crudPredicates } from '@common';

const { isMultipleSetter, isListGetter } = crudPredicates;

const getCrudServiceName = (typeName, crudName) => {
  switch (true) {
    case isListGetter(crudName):
      return `get${pluralize(typeName)}List`;

    case isMultipleSetter(crudName):
      return `${crudName}${pluralize(typeName)}`;

    default:
      return `${crudName}${typeName}`;
  }
};

export default getCrudServiceName;
