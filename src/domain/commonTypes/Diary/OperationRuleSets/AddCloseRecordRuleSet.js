import { BaseOperationRuleSet } from './BaseOperationRuleSet';
import {
  diaryClosed,
  recordAlreadyExists,
  recordDuplicate,
} from './OperationRules';

export class AddCloseRecordRuleSet extends BaseOperationRuleSet {
  static ruleSet = [];
}
