import { errors } from '../../../../errors';
import { OperationRule } from '../OperationRule';
import { makeExcludeRecordOption } from '../_lib';

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
      excludeRecords: makeExcludeRecordOption(excludeRecord),
    };

    if (this.excludeRecordArgName) {
      // console.log(`day: ${day.toString()}`);
      // console.log(excludeRecordsOption.excludeRecords[0].day.toString());
      // console.log(operatee.hasRecordOn(day, excludeRecordsOption));
    }
    if (operatee.hasRecordOn(day, excludeRecordsOption)) {
      throw this.error();
    }
  }
}
