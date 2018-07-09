import { errors } from '../../../../errors';

export function recordAlreadyExists(day, options = {}) {
  if (this.operatable._hasRecordOn(day, options)) {
    throw errors.recordAlreadyExists();
  }
}
