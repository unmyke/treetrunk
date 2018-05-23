import { BaseClass } from '../BaseClass';

const valueEquality = (value1, value2) => {
  if (value1 instanceof BaseValue) {
    return value1.equals(value2);
  }
  return value1.valueOf() === value2.valueOf();
};

export class BaseValue extends BaseClass {
  equals(value) {
    if (this === value) {
      return true;
    }

    if (value === undefined || value.constructor !== this.constructor) {
      return false;
    }

    const thisPropNames = Object.getOwnPropertyNames(this).sort();
    const valuePropNames = Object.getOwnPropertyNames(value).sort();

    return thisPropNames.reduce((isEqual, propertyName, index) => {
      return (
        isEqual &&
        propertyName === valuePropNames[index] &&
        valueEquality(this[propertyName], value[propertyName])
      );
    }, true);
  }
}
