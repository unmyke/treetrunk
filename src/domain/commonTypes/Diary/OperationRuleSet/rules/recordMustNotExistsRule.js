import { errors } from '../../../../errors';
import { OperationRule } from '../OperationRule';

export class RecordMustNotExistsRule extends OperationRule {
  constructor({
    error = errors.recordAlreadyExists,
    recordArgName = 'record',
    excludeRecordArgName,
  } = {}) {
    super({ error });
    this.recordArgName = recordArgName;
    this.excludeRecordArgName = excludeRecordArgName;
  }

  execute(
    operatee,
    {
      [this.recordArgName]: { day },
      [this.excludeRecordArgName]: excludeRecord,
    }
  ) {
    const excludeRecordsOption = {
      excludeRecords: [excludeRecord],
    };

    if (operatee.hasRecordOn(day, excludeRecordsOption)) {
      throw this.error();
    }
  }
}
