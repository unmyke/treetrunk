import { crudPredicates } from '@common';
const { isListGetter, isMultipleSetter } = crudPredicates;

const getArgs = ({ ctx, crudName, type }) => {
  const {
    args: { id, list },
  } = ctx;
};
