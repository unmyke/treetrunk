import { OperationRule } from '../OperationRule';

// export function recordMustNotDuplicateRule(
//   { record: { value, day } },
//   options = {}
// ) {
//   const prevRecord = this.operatee.getPrevRecordAt(day, options);
//   const nextRecord = this.operatee.getNextRecordAt(day, options);

//   if (
//     (prevRecord !== undefined && value === prevRecord.value) ||
//     (nextRecord !== undefined && value === nextRecord.value)
//   ) {
//     throw this.errors.recordDuplicate();
//   }
// }

export class RecordMustNotDuplicateRule extends OperationRule {
  execute(
    {
      operatee,
      record: { value, day },
    },
    options = {}
  ) {
    const prevRecord = operatee.getPrevRecordAt(day, options);
    const nextRecord = operatee.getNextRecordAt(day, options);

    if (
      (prevRecord !== undefined && value === prevRecord.value) ||
      (nextRecord !== undefined && value === nextRecord.value)
    ) {
      throw this.errors.recordDuplicate();
    }
  }
}
