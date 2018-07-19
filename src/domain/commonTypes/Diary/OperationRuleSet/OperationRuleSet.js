import { ruleSets } from './ruleSets';

export class OperationRuleSet {
  constructor({ operatee, operationName }) {
    this.operatee = operatee;
    this.ruleSet = ruleSets[operationName];
  }

  check(args) {
    this.ruleSet.forEach((ruleSetItem) => {
      ruleSetItem.execute(this.operatee, args);
    });
  }
}
