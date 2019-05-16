import pluralize from 'pluralize';
import { crudPredicates } from '@common';

const { isMultipleSetter, isListGetter } = crudPredicates;

const getServiceName = ({ type: { name: typeName }, crudName }) => {
  switch (true) {
    case isListGetter(crudName):
      return `get${pluralize(typeName)}List`;

    case isMultipleSetter(crudName):
      return `${crudName}${pluralize(typeName)}`;

    default:
      return `${crudName}${typeName}`;
  }
};

export default getServiceName;
