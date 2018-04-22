import validate from 'validate.js';
import { isValidDay } from './dayHelpers';

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
    if (!value || !isValidDay(value)) {
      return 'are not date';
    }
    return null;
  };

  validate.validators.dayRangeObject = (value) => {
    if (!value || !value.isValid()) {
      return 'are not date range';
    }
    return null;
  };
  
  return entityValidator;
};
