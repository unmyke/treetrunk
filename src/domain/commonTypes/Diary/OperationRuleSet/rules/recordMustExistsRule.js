import { OperationRule } from '../OperationRule';

// export function recordMustExistsRule({ record }, options) {
//   if (!this.operatee.hasRecord(record, options)) {
//     throw this.errors.recordNotFound();
//   }
// }

export class RecordMustExistsRule extends OperationRule {
  execute(operatee, { record }, options) {
    if (!operatee.hasRecord(record, options)) {
      throw this.errors.recordNotFound();
    }
  }
}
