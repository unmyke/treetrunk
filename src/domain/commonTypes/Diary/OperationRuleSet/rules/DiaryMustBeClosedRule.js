import { OperationRule } from '../OperationRule';

// export function diaryMustNotBeClosedAtRecordDay({ record: { day } }) {
//   if (this.operatee.isClosedAt(day)) {
//     throw this.errors.diaryClosed();
//   }
// }

export class DiaryMustBeClosedRule extends OperationRule {
  execute(operatee) {
    if (!operatee.isClosed) {
      throw this.errors.diaryNotClosed();
    }
  }
}
