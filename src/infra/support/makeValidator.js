import validate from 'validate.js';
import { isValidDate } from './dateHelpers';

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

  validate.validators.dateObject = (value) => {
    if (!value || !isValidDate(value)) {
      return 'are not date';
    }
    return null;
  };

  validate.validators.dateRangeObject = (value) => {
    if (!value || !value.isValid()) {
      return 'are not date range';
    }
    return null;
  };
  
  return entityValidator;
};
