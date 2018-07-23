import { diaryMustBeStarted, diaryMustHasNotRecordsLater } from '../rules';

export const addCloseRecordRuleSet = [
  diaryMustBeStarted,
  diaryMustHasNotRecordsLater,
];
