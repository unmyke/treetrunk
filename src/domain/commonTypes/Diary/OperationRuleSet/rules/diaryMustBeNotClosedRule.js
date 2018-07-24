import { errors } from '../../../../errors';
import { OperationRule } from '../OperationRule';

export class DiaryMustBeNotClosedRule extends OperationRule {
  constructor({ error = errors.diaryClosed, recordArgName = 'record' } = {}) {
    super({ error });
    this.recordArgName = recordArgName;
  }

  execute(
    operatee,
    {
      [this.recordArgName]: { day },
    }
  ) {
    if (operatee.isDiaryClosedAt(day)) {
      throw this.error();
    }
  }
}
