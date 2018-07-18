export class OperationRuleSet {
  constructor({ operatee }) {
    this.operatee = operatee;
  }

  check(args) {
    this._executeRuleSet(this.constructor.ruleSet, args);
  }

  _executeRuleSet(ruleSet, args) {
    ruleSet.forEach((rule) => {
      this._executeRuleSetItem(rule, args);
    });
  }

  _executeRuleSetItem(ruleSetItem, args) {
    switch (ruleSetItem.constructor) {
      case Rule:
        this._checkRule(ruleSetItem, args);
        break;

      case Condition:
        this._checkCondition(ruleSetItem, args);
        break;
    }
  }

  _checkRule(rule, args) {
    rule.call(this, args);
  }

  _checkCondition({ predicate, onTrue, onFalse }, args) {
    this._executeRuleSet(predicate(args) ? onTrue : onFalse, args);
  }
}
