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

  execute(operatee, { [this.recordArgName]: record }) {
    if (!operatee.hasRecord(record, this._options)) {
      throw this.error();
    }
  }
}
