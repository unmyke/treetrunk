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
    const predicateResult = this.predicate(operatee, args);

    if (this[`on${upperFirst(predicateResult)}`]) {
      this[`on${upperFirst(predicateResult)}`].forEach((ruleSetItem) => {
        ruleSetItem.execute(operatee, args);
      });
    }
  }
}
