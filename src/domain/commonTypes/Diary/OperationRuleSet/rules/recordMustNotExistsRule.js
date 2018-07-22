import { OperationRule } from '../OperationRule';

// export function recordMustNotExistsRule({ record: { day } }, options = {}) {
//   if (this.operatee.hasRecordOn(day, options)) {
//     throw this.errors.recordAlreadyExists();
//   }
// }

export class RecordMustNotExistsRule extends OperationRule {
  execute(
    operatee,
    {
      record: { day },
    },
    options = {}
  ) {
    if (operatee.hasRecordOn(day, options)) {
      throw this.errors.recordAlreadyExists();
    }
  }
}
