new EventEmmiterError({
  message: 'Output not found',
  details: {
    [this.constructor.name]: `Invalid output "${output}" to operation ${
      this.constructor.name
    }.`,
  },
});

new PostValidationError({
  message: 'Value is invalid',
  details: {
    property1: ['validation costraints text'],
  },
});

new DayValidationError({
  message: 'Value is invalid',
  details: {
    value: ['Not a Date instance'],
  },
});

new DayValidationError({
  message: 'Value is invalid',
  details: {
    day: ['Not a Day instance'],
  },
});

new DayValidationError({
  message: 'Value is invalid',
  details: {
    day: ['Not a Number instance'],
  },
});

new DayRangeValidationError({
  message: 'Value is invalid',
  details: {
    day: ['Not a DayRage instance'],
  },
});

new PostOperationError({
  message: 'Value dublication',
  details: {
    pieceRates: [`Post already have piece rate ${value} at ${day}`],
  },
});

new PostOperationError({
  message: 'Not found',
  details: {
    pieceRates: [`Post have not piece rate ${value} at ${day}`],
  },
});

new SellerOperationError({
  message: 'Value dublication',
  details: {
    appointments: [`Seller already appoint to post with postId ${postId}`],
  },
});

new SellerOperationError({
  message: 'Value not found',
  details: {
    appointments: [`Seller does not appoint to post with postId ${postId}`],
  },
});

new SellerOperationError({
  message: 'Not consistent operation',
  details: {
    appointments: ['Seller cannot take quit before or on the recruit day'],
  },
});

new SeniorityTypeOperationError({
  message: 'Already exists',
  details: {
    appointments: [`SeniorityType already have award ${value} at ${day}`],
  },
});

new SeniorityTypeOperationError({
  message: 'Not found',
  details: {
    pieceRates: [`SeniorityType have not award ${value} at ${day}`],
  },
});

new RepositoryError({
  message: 'Not found',
  details: {
    pieceRates: [`${entity} have not award ${value} at ${day}`],
  },
});
