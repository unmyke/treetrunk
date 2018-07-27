import { errors } from '../../../../errors';
import { OperationRule } from '../OperationRule';

export class RecordMustExistsRule extends OperationRule {
  constructor({
    error = errors.recordNotFound,
    recordArgName = 'record',
  } = {}) {
    super({ error });
    this.recordArgName = recordArgName;
  }

  execute(
    operatee,
    {
      [this.recordArgName]: { day },
    }
  ) {
    if (!operatee.hasRecordOn(day, this._options)) {
      throw this.error();
    }
  }
}
