import {
  mustNotBeClosedAtRecordDay,
  recordMustExists,
  recordMustNotHasEqualNeightbors,
} from '../rules';

export const deleteRecordRuleSet = [
  mustNotBeClosedAtRecordDay,
  recordMustExists,
  recordMustNotHasEqualNeightbors,
];
