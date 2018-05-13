const errors = [];

errors.push({
  type: 'EVENT_EMMITER_ERROR',
  code: 'OUTPUT_NOT_FOUND',
  message: 'Output not found',
  // details: {
  //   [this.constructor.name]: `Invalid output "${output}" to operation ${
  //     this.constructor.name
  //   }.`,
  // },
});

errors.push({
  type: 'VALIDATION_ERROR',
  code: 'INVALID_VALUE',
  message: 'Invalid value',
  // details: {
  //   property1: ['validation costraints text'],
  // },
});

errors.push({
  type: 'VALIDATION_ERROR',
  code: 'INVALID_VALUE',
  message: 'Invalid value',
  // details: {
  //   value: ['Not a Date instance'],
  // },
});

errors.push({
  type: 'VALIDATION_ERROR',
  code: 'INVALID_VALUE',
  message: 'Invalid value',
  // details: {
  //   day: ['Not a Day instance'],
  // },
});

errors.push({
  type: 'VALIDATION_ERROR',
  code: 'INVALID_VALUE',
  message: 'Invalid value',
  // details: {
  //   day: ['Not a Number instance'],
  // },
});

errors.push({
  type: 'VALIDATION_ERROR',
  code: 'INVALID_VALUE',
  message: 'Invalid value',
  // details: {
  //   day: ['Not a DayRage instance'],
  // },
});

errors.push({
  type: 'OPERATION_ERROR',
  code: 'DUBLICATE_VALUE',
  message: 'Dublicate value',
  // details: {
  //   pieceRates: [`Post already have piece rate ${value} at ${day}`],
  // },
});

errors.push({
  type: 'OPERATION_ERROR',
  code: 'NOT_FOUND',
  message: 'Not found',
  // details: {
  //   pieceRates: [`Post have not piece rate ${value} at ${day}`],
  // },
});

errors.push({
  type: 'OPERATION_ERROR',
  code: 'DUBLICATE_VALUE',
  message: 'Dublicate value',
  // details: {
  //   appointments: [`Seller already appoint to post with postId ${postId}`],
  // },
});

errors.push({
  type: 'OPERATION_ERROR',
  code: 'NOT_FOUND',
  message: 'Not found',
  // details: {
  //   appointments: [`Seller does not appoint to post with postId ${postId}`],
  // },
});

errors.push({
  type: 'OPERATION_ERROR',
  code: 'INCONSISTENT_VALUE',
  message: 'Inconsistent value',
  // details: {
  //   appointments: ['Seller cannot take quit before or on the recruit day'],
  // },
});

errors.push({
  type: 'OPERATION_ERROR',
  code: 'ALREADY_EXISTS',
  message: 'Already exists',
  // details: {
  //   appointments: [`SeniorityType already have award ${value} at ${day}`],
  // },
});

errors.push({
  type: 'OPERATION_ERROR',
  code: 'NOT_FOUND',
  message: 'Not found',
  // details: {
  //   pieceRates: [`SeniorityType have not award ${value} at ${day}`],
  // },
});

errors.push({
  type: 'PERSISTENCE_ERROR',
  code: 'NOT_FOUND',
  message: 'Not found',
  // details: {
  //   pieceRates: [`${entity} not found`],
  // },
});

errors.push({
  type: 'PERSISTENCE_ERROR',
  code: 'ALRAEDY_EXISTS',
  message: 'Alraedy exists',
  // details: {
  //   pieceRates: [`${entity} already exists`],
  // },
});
