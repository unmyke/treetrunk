import { DiaryMustHasNotRecordsLater } from '../Rules';

const diaryMustHasNotRecordsLaterWithoutCloseRecord = new DiaryMustHasNotRecordsLater(
  {
    excludeCloseRecord: true,
  }
);

export const updateCloseRecordRuleSet = [
  diaryMustHasNotRecordsLaterWithoutCloseRecord,
];
