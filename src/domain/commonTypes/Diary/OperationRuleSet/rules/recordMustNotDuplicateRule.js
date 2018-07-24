import { errors } from '../../../../errors';
import { OperationRule } from '../OperationRule';

export class RecordMustNotDuplicateRule extends OperationRule {
  constructor({
    error = errors.recordDuplicate,
    recordArgName = 'record',
  } = {}) {
    super({ error });
    this.recordArgName = recordArgName;
  }

  execute(operatee, args) {
    const {
      [this.recordArgName]: { value, day },
    } = args;

    const excludeRecordsOption = {};
    if (this._options.excludeRecordArgName) {
      excludeRecordsOption.excludeRecords = [
        args[this._options.excludeRecordArgName],
      ];
    }

    const prevRecord = operatee.getPrevRecordAt(day, excludeRecordsOption);
    const nextRecord = operatee.getNextRecordAt(day, excludeRecordsOption);

    if (
      (prevRecord !== undefined && value === prevRecord.value) ||
      (nextRecord !== undefined && value === nextRecord.value)
    ) {
      throw this.error();
    }
  }
}
