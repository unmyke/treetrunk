import { BaseOperationRuleSet } from './BaseOperationRuleSet';
import {
  diaryClosed,
  recordNotFound,
  recordHasEqualNeightbors,
} from './OperationRules';

export class DeleteCloseRecordRuleSet extends BaseOperationRuleSet {
  static ruleSet = [diaryClosed, recordNotFound, recordHasEqualNeightbors];
}
