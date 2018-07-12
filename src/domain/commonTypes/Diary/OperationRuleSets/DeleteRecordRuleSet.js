import { BaseOperationRuleSet } from './BaseOperationRuleSet';
import {
  mustNotBeClosedAtRecordDay,
  recordMustExists,
  recordMustNotHasEqualNeightbors,
} from './OperationRules';

export class DeleteRecordRuleSet extends BaseOperationRuleSet {
  static ruleSet = [
    mustNotBeClosedAtRecordDay,
    recordMustExists,
    recordMustNotHasEqualNeightbors,
  ];
}
