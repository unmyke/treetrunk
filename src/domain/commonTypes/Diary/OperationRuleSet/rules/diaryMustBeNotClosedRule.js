import { OperationRule } from '../OperationRule';

// export function diaryMustNotBeClosedAtRecordDay({ record: { day } }) {
//   if (this.operatee.isClosedAt(day)) {
//     throw this.errors.diaryClosed();
//   }
// }

export class DiaryMustBeNotClosedRule extends OperationRule {
  execute(
    operatee,
    {
      record: { day },
    }
  ) {
    if (operatee.isDiaryClosedAt(day)) {
      throw this.errors.diaryClosed();
    }
  }
}
