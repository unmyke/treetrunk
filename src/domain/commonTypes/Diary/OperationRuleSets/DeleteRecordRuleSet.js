import { BaseOperationRuleSet } from './BaseOperationRuleSet';
import {
  diaryClosed,
  recordNotFound,
  recordHasEqualNeightbors,
} from './OperationRules';

export class DeleteRecordRuleSet extends BaseOperationRuleSet {
  static ruleSet = [diaryClosed, recordNotFound, recordHasEqualNeightbors];
}
