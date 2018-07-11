import { BaseOperationRuleSet } from './BaseOperationRuleSet';
import {
  diaryClosed,
  recordAlreadyExists,
  recordDuplicate,
} from './OperationRules';

export class SetRecordsRuleSet extends BaseOperationRuleSet {
  static ruleSet = [];
}
