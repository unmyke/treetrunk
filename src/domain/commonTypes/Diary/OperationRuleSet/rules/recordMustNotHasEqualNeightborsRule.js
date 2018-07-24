import { errors } from '../../../../errors';
import { OperationRule } from '../OperationRule';

export class RecordMustNotHasEqualNeightborsRule extends OperationRule {
  constructor({
    error = errors.recordHasEqualNeightbors,
    recordArgName = 'record',
    excludeRecordArgName,
  } = {}) {
    super({ error });
    this.recordArgName = recordArgName;
    this.excludeRecordArgName = excludeRecordArgName;
  }

  execute(
    operatee,
    { [this.recordArgName]: record, [this.excludeRecordArgName]: excludeRecord }
  ) {
    const excludeRecordsOption = {
      excludeRecords: [excludeRecord],
    };

    const prevRecord = operatee.getPrevRecord(record, excludeRecordsOption);
    const nextRecord = operatee.getNextRecord(record, excludeRecordsOption);

    if (
      prevRecord !== undefined &&
      nextRecord !== undefined &&
      operatee.compareRecordValues(prevRecord, nextRecord)
    ) {
      throw this.error();
    }
  }
}
