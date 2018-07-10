import { BaseOperationRuleSet } from './BaseOperationRuleSet';
import {
  diaryClosedRule,
  recordAlreadyExistsRule,
  recordDuplicateRule,
} from './OperationRules';

export class DeleteOperationRuleSet extends BaseOperationRuleSet {
  static ruleSet = [
    diaryClosedRule,
    recordAlreadyExistsRule,
    recordDuplicateRule,
  ];
}
