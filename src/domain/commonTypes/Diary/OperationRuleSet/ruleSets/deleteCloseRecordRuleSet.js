import { diaryClosed, recordNotFound, recordHasEqualNeightbors } from './Rules';

export const deleteCloseRecordRuleSet = [
  diaryClosed,
  recordNotFound,
  recordHasEqualNeightbors,
];
