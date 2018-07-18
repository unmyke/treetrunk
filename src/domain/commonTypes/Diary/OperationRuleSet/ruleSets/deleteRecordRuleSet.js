import {
  mustNotBeClosedAtRecordDay,
  recordMustExists,
  recordMustNotHasEqualNeightbors,
} from './Rules';

export const deleteRecordRuleSet = [
  mustNotBeClosedAtRecordDay,
  recordMustExists,
  recordMustNotHasEqualNeightbors,
];
