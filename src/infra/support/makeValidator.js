import validate from 'validate.js';
import { upperFirst, lowerFirst, snakeCase } from 'lodash';
import { Day, DayRange } from 'src/domain/_lib/ValueObjects';
import { ValidationError } from 'src/domain/_lib/Errors';

export const makeValidator = () => {
  const validator = (entity, options = { exception: false }) => {
    const validationErrors = validate(entity, entity.constructor.constraints);

    if (errors && options.exception) {
      const error = ValidationError.create(
        `${entity.constructor.name} is not valid.`,
        validationErrors,
        snakeCase(entity.constructor.name).toUpperCase()
      );

      err.details = validationErrors;
      throw err;
    }

    return errors;
  };

  validate.validators.association = (value) => {
    if (!value) {
      return null;
    }
    return validator(value);
  };

  validate.validators.dayObject = (value) => {
    if (!Day.isValid(value)) {
      return Day.errorNotADayRange.details[0];
    }
    return null;
  };

  validate.validators.dayRangeObject = (value) => {
    if (!DayRange.isValid(value)) {
      return DayRange.errorNotADayRange.details[0];
    }
    return null;
  };

  return validator;
};
