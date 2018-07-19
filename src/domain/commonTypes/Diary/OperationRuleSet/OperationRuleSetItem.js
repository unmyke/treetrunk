import { errors } from '../../../errors';

export class OperationRuleSetItem {
  constructor({ operatee, type }) {
    this.operatee = operatee;
    this.type = type;
    this.errors = errors;
  }

  execute(rule, args) {
    return rule.call(this, args);
  }
}
