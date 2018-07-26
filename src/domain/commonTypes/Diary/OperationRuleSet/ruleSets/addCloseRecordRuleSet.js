import { DiaryMustBeStarted, DiaryMustHasNotRecordsLater } from '../Rules';

const diaryMustBeStarted = new DiaryMustBeStarted();
const diaryMustHasNotRecordsLater = new DiaryMustHasNotRecordsLater();

export const addCloseRecordRuleSet = [
  diaryMustBeStarted,
  diaryMustHasNotRecordsLater,
];
