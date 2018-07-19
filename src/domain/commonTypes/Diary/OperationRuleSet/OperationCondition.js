import { upperFirst } from 'lodash';
import { BaseOperationRuleSetItem } from './BaseOperationRuleSetItem';

export class OperationCondition extends BaseOperationRuleSetItem {
  constructor({ predicate, onTrue, onFalse }) {
    super({ type: 'condition' });
    this.predicate = predicate;
    this.onTrue = onTrue;
    this.onFalse = onFalse;
  }

  execute(operatee, args) {
    this[`on${upperFirst(this.predicate(operatee, args))}`].forEach(
      (ruleSetItem) => {
        ruleSetItem.execute(operatee, args);
      }
    );
  }
}
