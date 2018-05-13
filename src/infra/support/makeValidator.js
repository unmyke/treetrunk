import validate from 'validate.js';
import { upperFirst, lowerFirst, snakeCase } from 'lodash';
import { Day, DayRange } from 'src/domain/_lib/ValueObjects';
import { Validation as ValidationErrorFactories } from '../../domain/_lib/ErrorFactories';

const validationErrorFactory = new ValidationErrorFactories();

export const makeValidator = (constraints) => {
  const validator = (entity, options = { exception: false }) => {
    const errors = validate(
      entity,
      constraints || entity.constructor.constraints
    );

    if (errors && options.exception) {
      const err = validationErrorFactory.create(errors);
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
