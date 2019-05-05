import { identity } from '@common';

export const actionTypes = {
  CREATE: 'CREATE',
  FILTER: 'FILTER',
  ERASE: 'ERASE',
  RESTORE: 'RESTORE',
  DELETE: 'DELETE',
  EDIT: 'EDIT',
};

export const headerTypes = {
  STRING: {
    name: 'STRING',
    isNumeric: false,
    value: identity,
  },
  DAY: {
    name: 'DAY',
    isNumeric: false,
    value: identity,
  },
  INTEGER: {
    name: 'INTEGER',
    isNumeric: true,
    value: identity,
  },
  FLOAT: {
    name: 'FLOAT',
    isNumeric: true,
    value: identity,
  },
  PERCENTAGE: {
    name: 'PERCENTAGE',
    isNumeric: true,
    value: identity,
  },
  CURRENCY: {
    name: 'CURRENCY',
    isNumeric: true,
    value: identity,
  },
};
