export function makeCondition({ predicate, onTrue, onFalse }) {
  return {
    type: 'condition',
    predicate,
    onTrue,
    onFalse,
    check: function(args) {
      this._checkRuleSet(predicate(args) ? this.onTrue : this.onFalse, args);
    },
    _checkRuleSet: function(ruleSet, args) {
      ruleSet.forEach((ruleSetItem) => ruleSetItem.check(args));
    },
  };
}
