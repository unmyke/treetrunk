import { BaseOperationRuleSet } from './BaseOperationRuleSet';
import {
  diaryClosed,
  recordAlreadyExists,
  recordDuplicate,
} from './OperationRules';

export class UpdateCloseRecordRuleSet extends BaseOperationRuleSet {
  static ruleSet = [];
}
