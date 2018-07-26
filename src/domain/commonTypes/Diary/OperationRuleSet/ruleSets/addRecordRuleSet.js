import {
  DiaryMustBeNotClosed,
  RecordMustNotExists,
  RecordMustNotDuplicate,
} from '../Rules';

const diaryMustBeNotClosed = new DiaryMustBeNotClosed();
const recordMustNotExists = new RecordMustNotExists();
const recordMustNotDuplicate = new RecordMustNotDuplicate();

export const addRecordRuleSet = [
  diaryMustBeNotClosed,
  recordMustNotExists,
  recordMustNotDuplicate,
];
