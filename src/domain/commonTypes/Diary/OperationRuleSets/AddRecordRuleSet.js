import { BaseOperationRuleSet } from './BaseOperationRuleSet';
import {
  mustNotBeClosedAtRecordDay,
  recordMustNotExists,
  recordMustNotDuplicate,
} from './OperationRules';

export class AddRecordRuleSet extends BaseOperationRuleSet {
  static ruleSet = [
    mustNotBeClosedAtRecordDay,
    recordMustNotExists,
    recordMustNotDuplicate,
  ];
}
