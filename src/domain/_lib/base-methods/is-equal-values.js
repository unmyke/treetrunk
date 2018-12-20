import { BaseValue } from '../base-value';

export const isEqualValues = (value1, value2) => {
  if (value1 instanceof BaseValue) {
    return value1.equals(value2);
  }

  return value1 === value2;
};
