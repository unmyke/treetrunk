import { errors } from '../../../../errors';
import { newRecordRuleWrapper } from '../_lib';

import {
  diaryMustBeNotClosed,
  recordMustExists,
  recordMustNotExists,
  recordMustNotHasEqualNeightbors,
  recordMustNotDuplicate,
} from '../rules';

import { isInLimitedScope } from '../predicates';
import { OperationCondition } from '../OperationCondition';

export const updateRecordRuleSet = [
  diaryMustBeNotClosed,
  recordMustExists,
  new OperationCondition({
    predicate: isInLimitedScope,
    onFalse: [
      recordMustNotHasEqualNeightbors,
      newRecordRuleWrapper(recordMustNotExists),
    ],
  }),
  newRecordRuleWrapper(diaryMustBeNotClosed),
  newRecordRuleWrapper(recordMustNotDuplicate),
];
