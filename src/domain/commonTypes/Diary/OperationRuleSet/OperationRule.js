import { BaseOperationRuleSetItem } from './BaseOperationRuleSetItem';
import { errors } from '../../../errors';

export class OperationRule extends BaseOperationRuleSetItem {
  constructor() {
    super({ type: 'rule' });
    this.errors = errors;
  }
}
