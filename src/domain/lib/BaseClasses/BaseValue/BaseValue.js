const valueEquality = (value1, value2) => {
  if (value1 instanceof BaseValue || value1 instanceof Date) {
    return value1.equals(value2);
  }
  return value1 === value2;
};

export class BaseValue {
  equals(value) {
    if (this === value) {
      return true;
    }

    if (value.constructor !== this.constructor) {
      return false;
    }

    const thisPropNames = Object.getOwnPropertyNames(this).sort();
    const valuePropNames = Object.getOwnPropertyNames(value).sort();

    return thisPropNames.reduce((isEqual, propertyName, index) => {
      return isEqual &&
        propertyName === valuePropNames[index] &&
        valueEquality(this[propertyName], value[propertyName]);
    }, true);
  }
}
