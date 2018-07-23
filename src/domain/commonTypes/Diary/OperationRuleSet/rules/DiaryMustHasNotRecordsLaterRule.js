import { OperationRule } from '../OperationRule';

export class DiaryMustHasNotRecordsLaterRule extends OperationRule {
  execute(operatee, { day }) {
    if (operatee.recordDay > day) {
      throw this.errors.diaryHasRecordsLater();
    }
  }
}
