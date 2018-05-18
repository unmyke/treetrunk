import validate from 'validate.js';
import { upperFirst, lowerFirst, snakeCase } from 'lodash';
import { Day, DayRange } from 'src/domain/commonTypes';
import isValidDate from 'date-fns/is_valid';

export const makeValidator = (constraints, errorFactory) => {
  const validator = (entity, options = { exception: false }) => {
    const errors = validate(
      entity,
      constraints || entity.constructor.constraints
    );

    if (errors && options.exception) {
      const err = errorFactory.create(errors);
      throw err;
    }

    return errors;
  };

  validate.validators.hasOne = (value) => {
    if (!value) {
      return null;
    }
    return validator(value);
  };

  validate.validators.hasMany = (value) => {
    if (value.length === 0) {
      return null;
    }
    return value.map(validator);
  };

  validate.validators.numberValue = (value, options) => {
    const number = Number.parseInt(value);
    if (validate(number, { numericality: options })) {
      return `${value} is not valid Date`;
    }
    return null;
  };

  validate.validators.dateValue = (value) => {
    const date = new Date(value);
    if (!isValidDate(date)) {
      return `${value} is not valid Date`;
    }
    return null;
  };

  validate.validators.dayObject = (value) => {
    if (!Day.isValid(value)) {
      return `${value} is not valid Day`;
    }
    return null;
  };

  validate.validators.dayRangeObject = (value) => {
    if (!DayRange.isValid(value)) {
      return `${value} is not valid DayRange`;
    }
    return null;
  };

  return validator;
};
