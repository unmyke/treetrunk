import {
  DiaryMustBeNotClosed,
  RecordMustExists,
  RecordMustNotHasEqualNeightbors,
} from '../Rules';

const diaryMustBeNotClosed = new DiaryMustBeNotClosed();
const recordMustExists = new RecordMustExists();
const recordMustNotHasEqualNeightbors = new RecordMustNotHasEqualNeightbors();

export const deleteRecordRuleSet = [
  diaryMustBeNotClosed,
  recordMustExists,
  recordMustNotHasEqualNeightbors,
];
