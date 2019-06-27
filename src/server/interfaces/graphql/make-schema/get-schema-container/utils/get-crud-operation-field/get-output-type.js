import { crudPredicates } from '@common';
const { isListGetter, isMultipleSetter } = crudPredicates;

const getOutputType = ({ ctx, crudName, type }) => {
  const {
    utils: { getTypeConnection },
  } = ctx;

  if (isListGetter(crudName) || isMultipleSetter(crudName))
    return getTypeConnection(type);
  return type;
};
export default getOutputType;
