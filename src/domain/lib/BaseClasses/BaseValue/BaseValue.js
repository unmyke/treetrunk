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

    if (thisPropNames.length !== valuePropNames.length) {
      return false;
    }

    return thisPropNames.reduce((isEqual, propertyName, index) => {
      return isEqual &&
        propertyName === valuePropNames[index] &&
        this[propertyName] === value[propertyName];
    }, true);
  }
}
