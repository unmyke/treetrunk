import { DiaryMustBeClosed, DiaryMustHasNotRecordsLater } from '../Rules';

const diaryMustBeClosed = new DiaryMustBeClosed();
const diaryMustHasNotRecordsLaterWithoutCloseRecord = new DiaryMustHasNotRecordsLater(
  {
    excludeCloseRecord: true,
  }
);

export const updateCloseRecordRuleSet = [
  diaryMustBeClosed,
  diaryMustHasNotRecordsLaterWithoutCloseRecord,
];
