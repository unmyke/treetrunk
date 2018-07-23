import {
  diaryMustBeNotClosed,
  recordMustExists,
  recordMustNotHasEqualNeightbors,
} from '../rules';

export const deleteRecordRuleSet = [
  diaryMustBeNotClosed,
  recordMustExists,
  recordMustNotHasEqualNeightbors,
];
