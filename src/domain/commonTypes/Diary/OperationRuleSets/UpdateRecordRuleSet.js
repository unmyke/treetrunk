import { BaseOperationRuleSet } from './BaseOperationRuleSet';
import { newRecordRuleWrapper, makeCondition } from './_lib';

import {
  diaryMustBeNotClosed,
  recordMustExists,
  recordMustNotExists,
  recordMustNotHasEqualNeightbors,
  recordMustNotDuplicate,
} from './OperationRules';

import { isInLimitedScope } from './OperationPredicates';

export class UpdateRecordRuleSet extends BaseOperationRuleSet {
  static ruleSet = [
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
}
