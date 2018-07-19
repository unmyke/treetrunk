import { DiaryMustBeNotClosedRule as DiaryMustBeNotClosed } from './DiaryMustBeNotClosedRule';
import { RecordMustExistsRule as RecordMustExists } from './RecordMustExistsRule';
import { RecordMustNotDuplicateRule as RecordMustNotDuplicate } from './RecordMustNotDuplicateRule';
import { RecordMustNotExistsRule as RecordMustNotExists } from './RecordMustNotExistsRule';
import { RecordMustNotHasEqualNeightborsRule as RecordMustNotHasEqualNeightbors } from './RecordMustNotHasEqualNeightborsRule';

const diaryMustBeNotClosed = new DiaryMustBeNotClosed();
const recordMustExists = new RecordMustExists();
const recordMustNotDuplicate = new RecordMustNotDuplicate();
const recordMustNotExists = new RecordMustNotExists();
const recordMustNotHasEqualNeightbors = new RecordMustNotHasEqualNeightbors();

export {
  diaryMustBeNotClosed,
  recordMustExists,
  recordMustNotDuplicate,
  recordMustNotExists,
  recordMustNotHasEqualNeightbors,
};
