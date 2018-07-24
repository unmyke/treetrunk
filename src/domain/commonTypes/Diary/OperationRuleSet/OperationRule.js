import { BaseOperationRuleSetItem } from './BaseOperationRuleSetItem';

export class OperationRule extends BaseOperationRuleSetItem {
  constructor({ error }) {
    super({ type: 'rule' });

    this.error = error;
  }
}
