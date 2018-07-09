import { errors } from '../../../../errors';

export function recordDuplicate({ value, day }, options = {}) {
  const prevRecord = this.operateble._getPrevRecordAt(day, options);
  const nextRecord = this.operateble._getNextRecordAt(day, options);

  if (
    (prevRecord !== undefined && value === prevRecord.value) ||
    (nextRecord !== undefined && value === nextRecord.value)
  ) {
    throw errors.recordDuplicate();
  }
}
