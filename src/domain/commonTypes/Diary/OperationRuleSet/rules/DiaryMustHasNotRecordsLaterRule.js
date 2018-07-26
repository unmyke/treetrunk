import { errors } from '../../../../errors';
import { OperationRule } from '../OperationRule';

export class DiaryMustHasNotRecordsLaterRule extends OperationRule {
  constructor({ error = errors.diaryHasRecordsLater } = {}) {
    super({ error });
  }

  execute(operatee, { day }) {
    if (operatee.hasRecordsAfterDay(day.prev())) {
      throw this.error();
    }
  }
}
