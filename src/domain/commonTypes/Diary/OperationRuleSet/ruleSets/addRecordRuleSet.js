import {
  mustNotBeClosedAtRecordDay,
  recordMustNotExists,
  recordMustNotDuplicate,
} from '../rules';

export const addRecordRuleSet = [
  mustNotBeClosedAtRecordDay,
  recordMustNotExists,
  recordMustNotDuplicate,
];
