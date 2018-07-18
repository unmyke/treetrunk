import {
  mustNotBeClosedAtRecordDay,
  recordMustNotExists,
  recordMustNotDuplicate,
} from './Rules';

export const addRecordRuleSet = [
  mustNotBeClosedAtRecordDay,
  recordMustNotExists,
  recordMustNotDuplicate,
];
