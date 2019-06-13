import { startOfDay } from 'date-fns';

const create = (date) => {
  const value = startOfDay(date);
  const valueOf = () => value.valueOf();
  const toString = () => value.toString();

  return Object.freeze({
    value,
    valueOf,
    toString,
  });
};
export default ValueObject(create);
