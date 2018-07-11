import { BaseOperationRuleSet } from './BaseOperationRuleSet';
import { newRecordRuleWrapper } from './_lib';

import {
  diaryClosed,
  recordNotFound,
  recordAlreadyExists,
  recordHasEqualNeightbors,
  recordDuplicate,
} from './OperationRules';

import { isInLimitedScope } from './OperationPredicates';

export class UpdateRecordRuleSet extends BaseOperationRuleSet {
  static ruleSet = [
    diaryClosed,
    recordNotFound,
    newRecordRuleWrapper(diaryClosed),
    newRecordRuleWrapper(recordAlreadyExists),
    {
      predicate: isInLimitedScope,
      onFalse: [
        recordHasEqualNeightbors,
        newRecordRuleWrapper(recordDuplicate),
      ],
    },
  ];
}
