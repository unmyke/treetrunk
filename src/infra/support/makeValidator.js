import validate from 'validate.js';
import { Day, DayRange } from 'src/domain/commonTypes';
import isValidDate from 'date-fns/is_valid';

const testRegex = {
  uuidv4(value) {
    return this._test(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      value
    );
  },
  phone(value) {
    return this._test(/^\+7( \d{3}){2}(-\d{2}){2}$/, value);
  },
  _test: (regex, value) => regex.test(value),
};

export const makeValidator = (constraints, errors) => {
  const validator = (entity, options = { exception: false }) => {
    const validationErrors = validate(
      entity,
      constraints || entity.constructor.constraints,
      { format: 'flat' }
    );

    if (validationErrors && options.exception) {
      throw errors.validationError(validationErrors);
    }

    return validationErrors;
  };

  validate.validators.hasOne = (value) => {
    if (!value) {
      return null;
    }
    return validator(value);
  };

  validate.validators.hasMany = (value) => {
    if (Array.isArray(value) || value.length === 0) {
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

  validate.validators.uuidv4 = (value) => {
    if (value && !testRegex.uuidv4(value)) {
      return `"${value}" is not a valid UUIDV4.`;
    }

    return null;
  };

  validate.validators.phone = (value) => {
    if (value && !testRegex.phone(value)) {
      return `"${value}" is not a valid phone number.`;
    }

    return null;
  };

  validate.validators.notEmpty = (value) => {
    if (value !== undefined && validate.isEmpty(value)) {
      return "can't be empty.";
    }

    return null;
  };

  return validator;
};
