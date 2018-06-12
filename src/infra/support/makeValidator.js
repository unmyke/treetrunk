import validate from 'validate.js';
import { upperFirst, lowerFirst, snakeCase } from 'lodash';
import { Day, DayRange } from 'src/domain/commonTypes';
import isValidDate from 'date-fns/is_valid';

export const makeValidator = (constraints, errors) => {
  const validator = (entity, options = { exception: false }) => {
    const errors = validate(
      entity,
      constraints || entity.constructor.constraints
    );

    if (errors && options.exception) {
      const err = errors.create(errors);
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

  validate.validators.numericalityString = (value, options) => {
    const presenceError = validate.single(value, {
      presence: { allowEmpty: false },
    });
    if (presenceError) {
      return presenceError;
    }

    const number = Number.parseInt(value);
    return validate.single(number, {
      numericality: { ...options, message: `"${value}" is not a valid number` },
    });
  };

  validate.validators.metricObject = (metric, numericalityOptions) => {
    if (metric === undefined) {
      return "can't be blank";
    }

    const valueErrors = validate.single(metric.value, {
      numericalityString: {
        ...numericalityOptions,
      },
    });

    const dateErrors = validate.single(metric.date, {
      dateString: true,
    });

    if (valueErrors || dateErrors) {
      return [
        ...(valueErrors || []).map((error) => `value ${error}`),
        ...(dateErrors || []).map((error) => `date ${error}`),
      ];
    }
    return null;
  };

  validate.validators.percentageMetricObject = (metric) => {
    return validate.single(metric, {
      metricObject: {
        greaterThan: 0,
        lessThan: 100,
      },
    });
  };

  validate.validators.integerMetricObject = (metric) => {
    return validate.single(metric, {
      metricObject: {
        onlyInteger: true,
        greaterThan: 0,
      },
    });
  };

  validate.validators.dateString = (value) => {
    const presenceError = validate.single(value, {
      presence: { allowEmpty: false },
    });
    if (presenceError) {
      return presenceError;
    }

    const date = new Date(value);
    if (!isValidDate(date)) {
      return `"${value}" is not a valid date`;
    }
    return null;
  };

  validate.validators.dayObject = (value) => {
    if (!Day.isValid(value)) {
      return `"${value}" is not a valid day`;
    }
    return null;
  };

  validate.validators.dayRangeObject = (value) => {
    if (!DayRange.isValid(value)) {
      return `"${value}" is not a valid dayRange.`;
    }
    return null;
  };

  return validator;
};
