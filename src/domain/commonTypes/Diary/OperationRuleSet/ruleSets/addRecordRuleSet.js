import {
  diaryMustBeNotClosed,
  recordMustNotExists,
  recordMustNotDuplicate,
} from '../rules';

export const addRecordRuleSet = [
  diaryMustBeNotClosed,
  recordMustNotExists,
  recordMustNotDuplicate,
];
