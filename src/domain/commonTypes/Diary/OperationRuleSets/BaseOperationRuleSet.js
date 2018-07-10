import { errors } from '../../../errors';

export class BaseOperationRuleSet {
  constructor({ operatee }) {
    this.operatee = operatee;
    this.errors = errors;
  }

  check(args, options) {
    this.constructor.ruleSet.forEach((rule) => {
      rule.call(this, args, options);
    });
  }
}
