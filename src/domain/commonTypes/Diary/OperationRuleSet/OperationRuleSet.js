import * as ruleSets from './ruleSets';

export class OperationRuleSet {
  constructor({ operatee, operationName }) {
    this.operatee = operatee;
    this.ruleSet = ruleSets[operationName];
  }

  check(args) {
    if (this.ruleSet !== undefined) {
      this.ruleSet.forEach((ruleSetItem) => {
        ruleSetItem.execute(this.operatee, args);
      });
    }
  }
}
