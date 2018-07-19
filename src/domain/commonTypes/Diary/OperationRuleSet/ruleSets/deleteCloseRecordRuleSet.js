import {
  diaryClosed,
  recordNotFound,
  recordHasEqualNeightbors,
} from '../rules';

export const deleteCloseRecordRuleSet = [
  diaryClosed,
  recordNotFound,
  recordHasEqualNeightbors,
];
