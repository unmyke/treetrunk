import { diaryMustBeClosed, diaryMustHasNotRecordsLater } from '../rules';

export const updateCloseRecordRuleSet = [
  diaryMustBeClosed,
  diaryMustHasNotRecordsLater,
];
