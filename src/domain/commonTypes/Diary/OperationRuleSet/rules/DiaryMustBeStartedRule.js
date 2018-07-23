import { OperationRule } from '../OperationRule';

// export function diaryMustNotBeStartedAtRecordDay({ record: { day } }) {
//   if (this.operatee.isStartedAt(day)) {
//     throw this.errors.diaryStarted();
//   }
// }

export class DiaryMustBeStartedRule extends OperationRule {
  execute(operatee) {
    if (!operatee.isStarted) {
      throw this.errors.diaryNotStarted();
    }
  }
}
