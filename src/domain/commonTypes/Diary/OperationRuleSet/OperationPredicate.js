import * as predicates from './predicates';

export class OperationPredicate {
  constructor({ operatee }) {
    this.operatee = operatee;
  }
}

Object.keys(predicates).forEach((predicateName) => {
  OperationPredicate.prototype[predicateName] = predicates[predicateName];
});
