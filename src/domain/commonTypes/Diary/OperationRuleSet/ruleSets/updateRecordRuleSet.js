import { newRecordRuleWrapper, makeCondition } from './_lib';

import {
  diaryMustBeNotClosed,
  recordMustExists,
  recordMustNotExists,
  recordMustNotHasEqualNeightbors,
  recordMustNotDuplicate,
} from '../rules';

import { isInLimitedScope } from '../predicates';

export const updateRecordRuleSet = [
  diaryMustBeNotClosed,
  recordMustExists,
  makeCondition({
    predicate: isInLimitedScope,
    onFalse: [
      recordMustNotHasEqualNeightbors,
      newRecordRuleWrapper(recordMustNotExists),
    ],
  }),
  newRecordRuleWrapper(diaryMustBeNotClosed),
  newRecordRuleWrapper(recordMustNotDuplicate),
];
