const { makeValidator, errors } = container;
const constraints = {
  firstName: { presence: { allowEmpty: false } },
  middleName: { presence: { allowEmpty: false } },
  lastName: { presence: { allowEmpty: false } },
  phone: {
    presence: { allowEmpty: false },
    format: { pattern: /^[0-9 \-\+\(\)]+$/ },
  },
};
const validator = makeValidator(constraints, errors);
const entity = {
  firstName: 'firstName',
  middleName: 'middleName',
  lastName: 'lastName',
  phone: '00-00-00',
};
const invalidEntity = {
  firstName: '',
  middleName: 'middleName',
  lastName: 'lastName',
  phone: '00-00-00',
};
validator(entity);
validator(invalidEntity);
const validate = require('validate.js');
validate(entity, constraints);
validate(invalidEntity, constraints);
