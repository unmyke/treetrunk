import { DiaryMustBeNotClosedRule as DiaryMustBeNotClosed } from './DiaryMustBeNotClosedRule';
import { DiaryMustBeClosedRule as DiaryMustBeClosed } from './DiaryMustBeClosedRule';
import { DiaryMustBeStartedRule as DiaryMustBeStarted } from './DiaryMustBeStartedRule';
import { DiaryMustHasNotRecordsLaterRule as DiaryMustHasNotRecordsLater } from './DiaryMustHasNotRecordsLaterRule';
import { RecordMustExistsRule as RecordMustExists } from './RecordMustExistsRule';
import { RecordMustNotDuplicateRule as RecordMustNotDuplicate } from './RecordMustNotDuplicateRule';
import { RecordMustNotExistsRule as RecordMustNotExists } from './RecordMustNotExistsRule';
import { RecordMustNotHasEqualNeightborsRule as RecordMustNotHasEqualNeightbors } from './RecordMustNotHasEqualNeightborsRule';

const diaryMustBeNotClosed = new DiaryMustBeNotClosed();
const diaryMustBeClosed = new DiaryMustBeClosed();
const diaryMustBeStarted = new DiaryMustBeStarted();
const diaryMustHasNotRecordsLater = new DiaryMustHasNotRecordsLater();
const recordMustExists = new RecordMustExists();
const recordMustNotDuplicate = new RecordMustNotDuplicate();
const recordMustNotExists = new RecordMustNotExists();
const recordMustNotHasEqualNeightbors = new RecordMustNotHasEqualNeightbors();

export {
  diaryMustBeNotClosed,
  diaryMustBeClosed,
  diaryMustBeStarted,
  diaryMustHasNotRecordsLater,
  recordMustExists,
  recordMustNotDuplicate,
  recordMustNotExists,
  recordMustNotHasEqualNeightbors,
};
