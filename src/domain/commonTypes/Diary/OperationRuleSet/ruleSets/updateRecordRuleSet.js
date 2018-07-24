import { errors } from '../../../../errors';

import {
  DiaryMustBeNotClosed,
  RecordMustExists,
  RecordMustNotExists,
  RecordMustNotHasEqualNeightbors,
  RecordMustNotDuplicate,
} from '../Rules';

const diaryMustBeNotClosed = new DiaryMustBeNotClosed();
const diaryMustBeNotClosedForNewRecord = new DiaryMustBeNotClosed({
  recordArgName: 'newRecord',
});

const recordMustExists = new RecordMustExists();
const newRecordMustNotExists = new RecordMustNotExists({
  recordArgName: 'newRecord',
  excludeRecordArgName: 'record',
});
const recordMustNotHasEqualNeightbors = new RecordMustNotHasEqualNeightbors({
  error: errors.isInLimitedScope,
});

const newRecordMustNotDuplicate = new RecordMustNotDuplicate({
  recordArgName: 'newRecord',
  excludeRecordArgName: 'record',
});

import { isInLimitedScope } from '../predicates';
import { OperationCondition } from '../OperationCondition';

export const updateRecordRuleSet = [
  diaryMustBeNotClosed,
  recordMustExists,
  new OperationCondition({
    predicate: isInLimitedScope,
    onFalse: [recordMustNotHasEqualNeightbors, newRecordMustNotExists],
  }),
  diaryMustBeNotClosedForNewRecord,
  newRecordMustNotDuplicate,
];
