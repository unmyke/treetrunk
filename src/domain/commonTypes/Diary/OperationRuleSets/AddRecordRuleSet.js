import { BaseOperationRuleSet } from './BaseOperationRuleSet';
import {
  diaryClosed,
  recordAlreadyExists,
  recordDuplicate,
} from './OperationRules';

export class AddRecordRuleSet extends BaseOperationRuleSet {
  static ruleSet = [diaryClosed, recordAlreadyExists, recordDuplicate];
}
