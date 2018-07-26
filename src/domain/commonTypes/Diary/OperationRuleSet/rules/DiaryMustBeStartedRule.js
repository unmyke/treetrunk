import { errors } from '../../../../errors';
import { OperationRule } from '../OperationRule';

export class DiaryMustBeStartedRule extends OperationRule {
  constructor({ error = errors.diaryNotStarted } = {}) {
    super({ error });
  }
  execute(operatee) {
    if (!operatee.isStarted) {
      throw this.error();
    }
  }
}
