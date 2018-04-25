import validate from 'validate.js';
import { Day, DayRange } from 'src/domain/_lib/ValueObjects';

export const makeValidator = () => {
  const entityValidator = (entity, options = { exception: false }) => {
    const errors = validate(entity, entity.constructor.constraints);
    if (errors && options.exception) {
      const err = new Error(`${entity.constructor.name} is not valid.
        Errors: (${JSON.stringify(errors)})`);
      err.errors = errors;
      throw err;
    }
    return errors;
  };

  validate.validators.association = (value) => {
    if (!value) {
      return null;
    }
    return entityValidator(value);
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

  return entityValidator;
};
