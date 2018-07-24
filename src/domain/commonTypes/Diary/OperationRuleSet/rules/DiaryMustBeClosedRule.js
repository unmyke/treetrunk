import { errors } from '../../../../errors';
import { OperationRule } from '../OperationRule';

export class DiaryMustBeClosedRule extends OperationRule {
  constructor({ error = errors.diaryNotClosed } = {}) {
    super({ error });
  }

  execute(operatee) {
    if (!operatee.isClosed) {
      throw this.error();
    }
  }
}
