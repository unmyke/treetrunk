import { errors } from '../../../errors';
import * as rules from './rules';

export class OperationRule {
  constructor({ operatee }) {
    this.operatee = operatee;
    this.errors = errors;
  }

  execute(ruleName, args) {
    return this[ruleName](args);
  }
}

Object.keys(rules).forEach((ruleName) => {
  OperationRule.prototype[ruleName] = rules[ruleName];
});
