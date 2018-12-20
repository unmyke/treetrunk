import { BaseClass } from '../base-class';
import { isEqualValues } from '../base-methods';

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
        isEqualValues(this[propertyName], value[propertyName])
      );
    }, true);
  }
}
