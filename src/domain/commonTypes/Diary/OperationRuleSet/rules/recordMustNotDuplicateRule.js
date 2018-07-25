import { errors } from '../../../../errors';
import { OperationRule } from '../OperationRule';
import { makeExcludeRecordOption } from '../_lib';

export class RecordMustNotDuplicateRule extends OperationRule {
  constructor({
    error = errors.recordDuplicate,
    recordArgName = 'record',
  } = {}) {
    super({ error });
    this.recordArgName = recordArgName;
  }

  execute(
    operatee,
    {
      [this.recordArgName]: { value, day },
      [this.excludeRecordArgName]: excludeRecord,
    }
  ) {
    const excludeRecordsOption = {
      excludeRecords: makeExcludeRecordOption(excludeRecord),
    };

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
