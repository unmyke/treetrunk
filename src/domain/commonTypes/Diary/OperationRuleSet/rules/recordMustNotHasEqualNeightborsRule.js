import { OperationRule } from '../OperationRule';

// export function recordMustNotHasEqualNeightborsRule({ record }, options = {}) {
//   const prevRecord = this.operatee.getPrevRecord(record, options);
//   const nextRecord = this.operatee.getNextRecord(record, options);

//   if (
//     prevRecord !== undefined &&
//     nextRecord !== undefined &&
//     this.operatee.compareRecordValues(prevRecord, nextRecord)
//   ) {
//     throw errors.recordHasEqualNeightbors();
//   }
// }

export class RecordMustNotHasEqualNeightborsRule extends OperationRule {
  execute(operatee, { record }, options = {}) {
    const prevRecord = operatee.getPrevRecord(record, options);
    const nextRecord = operatee.getNextRecord(record, options);

    if (
      prevRecord !== undefined &&
      nextRecord !== undefined &&
      operatee.compareRecordValues(prevRecord, nextRecord)
    ) {
      throw errors.recordHasEqualNeightbors();
    }
  }
}
