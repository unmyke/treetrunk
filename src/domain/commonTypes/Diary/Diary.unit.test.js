import { Diary } from './Diary';
import { BaseValue } from '../../_lib';
import { Day } from '../Day';
import { errors } from '../../errors';

class MockRecord extends BaseValue {
  constructor({ value, day }) {
    super();
    this.value = value;
    this.day = day;
  }
}

const day1 = new Day({ value: new Date('2017.01.20') });
const day2 = new Day({ value: new Date('2017.02.20') });
const day3 = new Day({ value: new Date('2017.03.20') });
const day4 = new Day({ value: new Date('2017.04.20') });
const day5 = new Day({ value: new Date('2017.05.20') });
const day6 = new Day({ value: new Date('2017.06.20') });
const day7 = new Day({ value: new Date('2017.07.20') });
const day8 = new Day({ value: new Date('2017.08.20') });
const day9 = new Day({ value: new Date('2017.09.20') });
//started diary records  without
const record1 = new MockRecord({ value: 8, day: day5 });
const record2 = new MockRecord({ value: 6, day: day6 });
const record3 = new MockRecord({ value: 8, day: day8 });
const records = [record1, record2, record3];
const closeValue = new MockRecord({ value: 'close' });
const closeRecord = new MockRecord({ value: closeValue, day: day3 });
const pastRecord1 = new MockRecord({ value: 1, day: day1 });
const allRecords = [pastRecord1, closeRecord, record1, record2, record3];
// add & update
const newRecordWithSameDay1 = new MockRecord({ value: 2, day: record2.day });
const newRecordWithSameValue = new MockRecord({
  value: record2.value,
  day: day7,
});
//add
const newPastRecord2 = new MockRecord({ value: 2, day: day2 });
const newFirstRecord = new MockRecord({ value: 4, day: day4 });
const newMidRecord = new MockRecord({ value: 7, day: day7 });
const newLastRecord = new MockRecord({ value: 9, day: day9 });
//delete
const nonExistentRecord = new MockRecord({ value: 5, day: day5 });
const nonExistentPastRecord = new MockRecord({ value: 5, day: day2 });
let diary;
let result;

describe('Domain :: lib :: Diary', () => {
  beforeEach(() => {
    diary = new Diary({ closeValue, RecordClass: MockRecord });
  });

  context('when diary is not started', () => {
    context('when initialized', () => {
      test('should be not started', () => {
        expect(diary.isStarted).toBe(false);
      });

      test('should have no records', () => {
        expect(diary.hasRecords).toBe(false);
        expect(diary.records).toEqual([]);
      });

      test('should have record value undefined', () => {
        expect(diary.recordValue).toBeUndefined();
      });

      test('should have start day undefined', () => {
        expect(diary.startDay).toBeUndefined();
      });

      test('should have close day undefined', () => {
        expect(diary._closeDay).toBeUndefined();
      });
    });

    describe('#addRecord', () => {
      beforeEach(() => {
        result = diary.addRecord({ record: record1 });
      });

      test('should return successful result', () => {
        expect(result).toEqual({ done: true, error: null });
      });

      test('should start diary', () => {
        expect(diary.isStarted).toBe(true);
        expect(diary.state).toBe('started');
      });

      test('should fill records', () => {
        expect(diary.hasRecords).toBe(true);
        expect(diary.records).toEqual([record1]);
      });

      test('should set added record value', () => {
        expect(diary.recordValue).toBe(record1.value);
      });

      test('should set start day', () => {
        expect(diary.startDay).toBe(record1.day);
      });

      test('should leave close day undefined', () => {
        expect(diary._closeDay).toBeUndefined();
      });
    });

    describe('#deleteRecord', () => {
      beforeEach(() => {
        result = diary.deleteRecord({ record: record1 });
      });

      test('should return unsuccessful result', () => {
        expect(result).toEqual({
          done: false,
          error: { mockRecord: [errors.diaryNotStarted().message] },
        });
      });

      test('should leave diary not started', () => {
        expect(diary.isStarted).toBe(false);
        expect(diary.state).toBe('new');
      });

      test('should leave records unchanged', () => {
        expect(diary.hasRecords).toBe(false);
        expect(diary.records).toEqual([]);
      });

      test('should leave record value undefined', () => {
        expect(diary.recordValue).toBeUndefined();
      });

      test('should leave start day undefined', () => {
        expect(diary.startDay).toBeUndefined();
      });

      test('should leave close day undefined', () => {
        expect(diary._closeDay).toBeUndefined();
      });
    });

    describe('#updateRecord', () => {
      beforeEach(() => {
        result = diary.updateRecord({ record: record1, newRecord: record1 });
      });

      test('should return unsuccessful result', () => {
        expect(result).toEqual({
          done: false,
          error: {
            newMockRecord: [],
            mockRecord: [errors.diaryNotStarted().message],
          },
        });
      });

      test('should leave diary not started', () => {
        expect(diary.isStarted).toBe(false);
      });

      test('should leave records unchanged', () => {
        expect(diary.hasRecords).toBe(false);
        expect(diary.records).toEqual([]);
        expect(diary.records).toHaveLength(0);
      });

      test('should leave record value undefined', () => {
        expect(diary.recordValue).toBeUndefined();
      });

      test('should leave start day undefined', () => {
        expect(diary.startDay).toBeUndefined();
      });

      test('should leave close day undefined', () => {
        expect(diary._closeDay).toBeUndefined();
      });
    });

    describe('#setRecords', () => {
      beforeEach(() => {
        result = diary.setRecords({ newRecords: records });
      });

      test('should return successful result', () => {
        expect(result).toEqual({ done: true, error: null });
      });

      test('should start diary', () => {
        expect(diary.isStarted).toBe(true);
      });

      test('should fill records', () => {
        expect(diary.hasRecords).toBe(true);
        expect(diary.records).toEqual([records[3]]);
        expect(diary.records).toHaveLength(1);
      });

      test('should set record value equal last element', () => {
        expect(diary.recordValue).toBe(records[3].value);
      });

      test('should set start day', () => {
        expect(diary.recordDay).toBe(records[3].day);
      });

      test('should leave close day undefined', () => {
        expect(diary._closeDay).toBeUndefined();
      });
    });

    describe('#addCloseRecord', () => {
      context('when diary is new', () => {
        beforeEach(() => {
          result = diary.addCloseRecord(day1);
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            error: {
              mockRecord: [errors.diaryNotStarted().message],
            },
          });
        });

        test('should leave diary not started', () => {
          expect(diary.isStarted).toBe(false);
        });

        test('should leave records unchanged', () => {
          expect(diary.hasRecords).toBe(false);
          expect(diary.records).toEqual([]);
        });

        test('should leave record value undefined', () => {
          expect(diary.recordValue).toBeUndefined();
        });

        test('should leave start day undefined', () => {
          expect(diary.startDay).toBeUndefined();
        });

        test('should leave close day undefined', () => {
          expect(diary._closeDay).toBeUndefined();
        });
      });

      context('when diary is closed', () => {
        beforeEach(() => {
          diary.setRecords({
            newRecords: [record1, record1, closeRecord],
          });
          result = diary.addCloseRecord(day5);
        });

        context('when initialized', () => {
          test('should have diary closed', () => {
            expect(diary.isClosed).toBe(true);
          });
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            error: {
              mockRecord: [errors.diaryNotStarted().message],
            },
          });
        });

        test('should leave diary closed', () => {
          expect(diary.isClosed).toBe(true);
        });

        test('should leave records unchanged', () => {
          expect(diary.hasRecords).toBe(false);
          expect(diary.records).toEqual([]);
        });

        test('should leave record value undefined', () => {
          expect(diary.recordValue).toBeUndefined();
        });

        test('should leave start day undefined', () => {
          expect(diary.startDay).toBeUndefined();
        });

        test('should leave close day unchanged', () => {
          expect(diary._closeDay).toBe(closeRecord.day);
        });
      });
    });

    describe('#deleteCloseRecord', () => {
      context('when diary is new', () => {
        beforeEach(() => {
          result = diary.deleteRecord();
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            error: {
              mockRecord: [errors.diaryNotClosed().message],
            },
          });
        });

        test('should leave diary not started', () => {
          expect(diary.isStarted).toBe(false);
        });

        test('should leave records unchanged', () => {
          expect(diary.hasRecords).toBe(false);
          expect(diary.records).toEqual([]);
        });

        test('should leave record value undefined', () => {
          expect(diary.recordValue).toBeUndefined();
        });

        test('should leave start day undefined', () => {
          expect(diary.startDay).toBeUndefined();
        });

        test('should leave close day undefined', () => {
          expect(diary._closeDay).toBeUndefined();
        });
      });

      describe('when diary is closed', () => {
        beforeEach(() => {
          diary.setRecords({
            newRecords: [record1, record1, closeRecord],
          });
          result = diary.deleteRecord();
        });

        test('should return successful result', () => {
          expect(result).toEqual({ done: true, error: null });
        });

        test('should make diary started', () => {
          expect(diary.isStarted).toBe(true);
          expect(diary.isClosed).toBe(false);
        });

        test('should restore records', () => {
          expect(diary.hasRecords).toBe(true);
          expect(diary.records).toEqual([record1, record1]);
        });

        test('should restore record value', () => {
          expect(diary.recordValue).toBe(record1.value);
        });

        test('should restore start day', () => {
          expect(diary.startDay).toBe(record1.day);
        });

        test('should set close day undefined', () => {
          expect(diary._closeDay).toBeUndefined();
        });
      });
    });

    describe('#updateCloseRecord', () => {
      context('when diary is new', () => {
        beforeEach(() => {
          result = diary.updateRecord(day1);
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            error: {
              newMockRecord: [],
              mockRecord: [errors.diaryNotClosed().message],
            },
          });
        });

        test('should leave diary not started', () => {
          expect(diary.isStarted).toBe(false);
        });

        test('should leave records unchanged', () => {
          expect(diary.hasRecords).toBe(false);
          expect(diary.records).toEqual([]);
        });

        test('should leave record value undefined', () => {
          expect(diary.recordValue).toBeUndefined();
        });

        test('should leave start day undefined', () => {
          expect(diary.startDay).toBeUndefined();
        });

        test('should leave close day undefined', () => {
          expect(diary._closeDay).toBeUndefined();
        });
      });

      context('when diary is closed', () => {
        beforeEach(() => {
          diary.setRecords({
            newRecords: [record1, record1, closeRecord],
          });
        });

        context('when passed day later than last record', () => {
          beforeEach(() => {
            result = diary.updateCloseRecord(day7);
          });

          test('should return successful result', () => {
            expect(result).toEqual({ done: true, error: null });
          });

          test('should leave diary closed', () => {
            expect(diary.isClosed).toBe(true);
          });

          test('should leave records unchanged', () => {
            expect(diary.hasRecords).toBe(false);
            expect(diary.records).toEqual([]);
          });

          test('should leave record value undefined', () => {
            expect(diary.recordValue).toBeUndefined();
          });

          test('should leave start day undefined', () => {
            expect(diary.startDay).toBeUndefined();
          });

          test('should change closed day of diary', () => {
            expect(diary._closeDay).toBe(day7);
          });
        });

        context('when passed day sooner than last record', () => {
          beforeEach(() => {
            result = diary.updateRecord(day3);
          });

          test('should return unsuccessful result', () => {
            expect(result).toEqual({
              done: false,
              error: {
                newMockRecord: [],
                mockRecord: [errors.diaryHasRecordsLater().message],
              },
            });
          });

          test('should leave diary closed', () => {
            expect(diary.isClosed).toBe(true);
          });

          test('should leave records unchanged', () => {
            expect(diary.hasRecords).toBe(false);
            expect(diary.records).toEqual([]);
          });

          test('should leave record value undefined', () => {
            expect(diary.recordValue).toBeUndefined();
          });

          test('should leave start day undefined', () => {
            expect(diary.startDay).toBeUndefined();
          });

          test('should leave close day unchanged', () => {
            expect(diary._closeDay).toBe(closeRecord.day);
          });
        });
      });
    });
  });

  context('when diary is started', () => {
    beforeEach(() => {
      diary.setRecords({ newRecords: records });
    });

    context('when initialized', () => {
      test('should not be closed', () => {
        expect(diary.isStarted).toBe(true);
        expect(diary.state).toBe('started');
      });

      test('should have records', () => {
        expect(diary.hasRecords).toBe(true);
        expect(diary.records).toEqual([record2, record3]);
      });

      test('should have record value', () => {
        expect(diary.recordValue).toBe(record3.value);
      });

      test('should have start day', () => {
        expect(diary.startDay).toBe(record2.day);
      });

      test('should have close day undefined', () => {
        expect(diary._closeDay).toBeUndefined();
      });
    });

    describe('#addRecord', () => {
      context('when diary already have record at passed day', () => {
        beforeEach(() => {
          result = diary.addRecord({ record: recordWithSameDay1 });
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            error: { mockRecord: [errors.recordAlreadyExists().message] },
          });
        });

        test('should leave diary started', () => {
          expect(diary.isStarted).toBe(true);
        });

        test('should leave records unchanged', () => {
          expect(diary.hasRecords).toBe(true);
          expect(diary.records).toEqual([record2, record3]);
        });

        test('should leave record value unchanged', () => {
          expect(diary.recordValue).toBe(record3.value);
        });

        test('should leave start day unchanged', () => {
          expect(diary.startDay).toBe(record2.day);
        });

        test('should leave close day unchanged', () => {
          expect(diary._closeDay).toBeUndefined();
        });
      });

      context('when diary already have record with passed value', () => {
        beforeEach(() => {
          result = diary.addRecord({ record: recordWithSameValue });
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            error: { mockRecord: [errors.recordDuplicate().message] },
          });
        });

        test('should leave diary started', () => {
          expect(diary.isStarted).toBe(true);
        });

        test('should leave records unchanged', () => {
          expect(diary.hasRecords).toBe(true);
          expect(diary.records).toEqual([record2, record3]);
        });

        test('should leave record value unchanged', () => {
          expect(diary.recordValue).toBe(record3.value);
        });

        test('should leave start day unchanged', () => {
          expect(diary.startDay).toBe(record2.day);
        });

        test('should leave close day unchanged', () => {
          expect(diary._closeDay).toBeUndefined();
        });
      });

      context('when passed record to closed diary', () => {
        beforeEach(() => {
          result = diary.addRecord({ record: pastRecord });
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            error: { mockRecord: [errors.diaryClosed().message] },
          });
        });

        test('should leave diary started', () => {
          expect(diary.isStarted).toBe(true);
        });

        test('should leave records unchanged', () => {
          expect(diary.hasRecords).toBe(true);
          expect(diary.records).toEqual([record2, record3]);
        });

        test('should leave record value unchanged', () => {
          expect(diary.recordValue).toBe(record3.value);
        });

        test('should leave start day unchanged', () => {
          expect(diary.startDay).toBe(record2.day);
        });

        test('should leave close day unchanged', () => {
          expect(diary._closeDay).toBeUndefined();
        });
      });

      context('when passed new record', () => {
        context('sooner than first record', () => {
          beforeEach(() => {
            result = diary.addRecord({ record: forgottenRecord });
          });

          test('should return successful result', () => {
            expect(result).toEqual({ done: true, error: null });
          });

          test('should leave diary started', () => {
            expect(diary.isStarted).toBe(true);
          });

          test('should change records', () => {
            expect(diary.hasRecords).toBe(true);
            expect(diary.records).toEqual([forgottenRecord, record2, record3]);
          });

          test('should leave record value unchanged', () => {
            expect(diary.recordValue).toBe(record3.value);
          });

          test('should change start day', () => {
            expect(diary.startDay).toBe(forgottenRecord.day);
          });

          test('should leave close day unchanged', () => {
            expect(diary._closeDay).toBeUndefined();
          });
        });

        context('later than first record', () => {
          context('sooner than last record', () => {
            beforeEach(() => {
              result = diary.addRecord({ record: newRecord });
            });

            test('should return successful result', () => {
              expect(result).toEqual({ done: true, error: null });
            });

            test('should leave diary started', () => {
              expect(diary.isStarted).toBe(true);
            });

            test('should change records', () => {
              expect(diary.hasRecords).toBe(true);
              expect(diary.records).toEqual([record2, newRecord, record3]);
            });

            test('should leave record value unchanged', () => {
              expect(diary.recordValue).toBe(record3.value);
            });

            test('should leave start day unchanged', () => {
              expect(diary.startDay).toBe(record2.day);
            });

            test('should leave close day unchanged', () => {
              expect(diary._closeDay).toBeUndefined();
            });
          });

          context('later than last record', () => {
            beforeEach(() => {
              result = diary.addRecord({ record: lastRecord });
            });

            test('should return successful result', () => {
              expect(result).toEqual({ done: true, error: null });
            });

            test('should leave diary started', () => {
              expect(diary.isStarted).toBe(true);
            });

            test('should change records', () => {
              expect(diary.hasRecords).toBe(true);
              expect(diary.records).toEqual([record2, record3, lastRecord]);
            });

            test('should change record value', () => {
              expect(diary.recordValue).toBe(lastRecord.value);
            });

            test('should leave start day unchanged', () => {
              expect(diary.startDay).toBe(record2.day);
            });

            test('should leave close day unchanged', () => {
              expect(diary._closeDay).toBeUndefined();
            });
          });
        });
      });
    });

    describe('#deleteRecord', () => {
      context('when passed non-existent record', () => {
        beforeEach(() => {
          result = diary.deleteRecord({ record: nonExistentRecord });
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            error: {
              mockRecord: [errors.recordNotFound().message],
            },
          });
        });

        test('should leave diary started', () => {
          expect(diary.isStarted).toBe(true);
        });

        test('should leave records unchanged', () => {
          expect(diary.hasRecords).toBe(false);
          expect(diary.records).toEqual([record2]);
        });

        test('should leave start day unchanged', () => {
          expect(diary.startDay).toBeUndefined(record2.day);
        });

        test('should leave close day unchanged', () => {
          expect(diary._closeDay).toBeUndefined();
        });
      });

      context('when passed existing record', () => {
        beforeEach(() => {
          diary.setRecords({
            newRecords: [forgottenRecord, newRecord],
          });
        });

        context('when initialized', () => {
          test('should match given conditions', () => {
            expect(diary.getRecordValueAt(forgottenRecord.day)).toEqual(
              diary.getRecordValueAt(newRecord.day)
            );
          });
        });

        context('when next and previous record values are similar', () => {
          beforeEach(() => {
            result = diary.deleteRecord({ record: record2 });
          });

          test('should return unsuccessful result', () => {
            expect(result).toEqual({
              done: false,
              error: {
                mockRecord: [errors.recordHasEqualNeightbors().message],
              },
            });
          });

          test('should leave diary started', () => {
            expect(diary.isStarted).toBe(true);
          });

          test('should leave records unchanged', () => {
            expect(diary.hasRecords).toBe(true);
            expect(diary.records).toEqual([
              forgottenRecord,
              record2,
              newRecord,
            ]);
          });

          test('should leave record value unchanged', () => {
            expect(diary.recordValue).toBe(newRecord.value);
          });

          test('should leave start day unchanged', () => {
            expect(diary.startDay).toBe(forgottenRecord.day);
          });

          test('should leave close day unchanged', () => {
            expect(diary._closeDay).toBeUndefined();
          });
        });

        context('when next and previous record values are different', () => {
          beforeEach(() => {
            result = diary.deleteRecord({ record: newRecord });
          });

          test('should return successful result', () => {
            expect(result).toEqual({ done: true, error: null });
          });

          test('should leave diary started', () => {
            expect(diary.isStarted).toBe(true);
          });

          test('should change records', () => {
            expect(diary.hasRecords).toBe(true);
            expect(diary.records).toEqual([forgottenRecord, record2]);
          });

          test('should change record value as needed', () => {
            expect(diary.recordValue).toBe(record2.value);
          });

          test('should leave start day unchanged as needed', () => {
            expect(diary.startDay).toBe(forgottenRecord.day);
          });
        });
      });

      context('when passed record of closed diary', () => {
        beforeEach(() => {
          result = diary.deleteRecord({ record: record1 });
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            error: {
              mockRecord: [errors.diaryClosed().message],
            },
          });
        });

        test('should leave diary started', () => {
          expect(diary.isStarted).toBe(true);
        });

        test('should leave records unchanged', () => {
          expect(diary.hasRecords).toBe(true);
          expect(diary.records).toEqual([record2]);
        });

        test('should leave record value unchanged', () => {
          expect(diary.recordValue).toBe(record2.value);
        });

        test('should leave start day unchanged', () => {
          expect(diary.startDay).toBe(record2.day);
        });

        test('should leave close day unchanged', () => {
          expect(diary._closeDay).toBeUndefined();
        });
      });
    });

    describe('#updateRecord', () => {
      context('when change non-existent record', () => {
        beforeEach(() => {
          result = diary.updateRecord({
            record: nonExistentRecord,
            newRecord: newRecord,
          });
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            error: {
              newMockRecord: [],
              mockRecord: [errors.recordNotFound().message],
            },
          });
        });

        test('should leave diary started', () => {
          expect(diary.isStarted).toBe(true);
        });

        test('should leave records unchanged', () => {
          expect(diary.hasRecords).toBe(false);
          expect(diary.records).toEqual([record2]);
        });

        test('should leave record value unchanged', () => {
          expect(diary.recordValue).toBe(record2.value);
        });

        test('should leave start day unchanged', () => {
          expect(diary.startDay).toBe(record2.day);
        });

        test('should leave close day unchanged', () => {
          expect(diary._closeDay).toBeUndefined();
        });
      });

      context('when change existing record', () => {
        beforeEach(() => {
          diary.setRecords({
            newRecords: [forgottenRecord, newRecord],
          });
        });

        context('when initialized', () => {
          test('should match given conditions', () => {
            expect(diary.getRecordValueAt(forgottenRecord.day)).toEqual(
              diary.getRecordValueAt(newRecord.day)
            );
          });
        });

        context('when diary already have record at updated day', () => {
          beforeEach(() => {
            result = diary.updateRecord({
              record: record2,
              newRecord: recordWithSameDay2,
            });
          });

          test('should return unsuccessful result', () => {
            expect(result).toEqual({
              done: false,
              error: {
                newMockRecord: [],
                mockRecord: [errors.recordAlreadyExists().message],
              },
            });
          });

          test('should leave diary started', () => {
            expect(diary.isStarted).toBe(true);
          });

          test('should leave records unchanged', () => {
            expect(diary.hasRecords).toBe(true);
            expect(diary.records).toEqual([
              forgottenRecord,
              record2,
              newRecord,
            ]);
          });

          test('should leave record value unchanged', () => {
            expect(diary.recordValue).toBe(record2.value);
          });

          test('should leave start day unchanged', () => {
            expect(diary.startDay).toBe(record2.day);
          });

          test('should leave close day unchanged', () => {
            expect(diary._closeDay).toBeUndefined();
          });
        });

        context('when next and previous record leave unchanged', () => {
          context('when new value is similar', () => {
            beforeEach(() => {
              result = diary.updateRecord({
                record: record2,
                newRecord: plannedRecord1,
              });
            });

            test('should return unsuccessful result', () => {
              expect(result).toEqual({
                done: false,
                error: {
                  newMockRecord: [],
                  mockRecord: [errors.recordDuplicate().message],
                },
              });
            });

            test('should leave diary started', () => {
              expect(diary.isStarted).toBe(true);
            });

            test('should leave records unchanged', () => {
              expect(diary.hasRecords).toBe(true);
              expect(diary.records).toEqual([
                forgottenRecord,
                record2,
                newRecord,
              ]);
            });

            test('should leave record value unchanged', () => {
              expect(diary.recordValue).toBe(record2.value);
            });

            test('should leave start day unchanged', () => {
              expect(diary.startDay).toBe(record2.day);
            });

            test('should leave close day unchanged', () => {
              expect(diary._closeDay).toBeUndefined();
            });
          });

          context('when new value leave unchanged or different', () => {
            beforeEach(() => {
              result = diary.updateRecord({
                record: record2,
                newRecord: plannedRecord2,
              });
            });

            test('should return successful result', () => {
              expect(result).toEqual({ done: true, error: null });
            });

            test('should change records', () => {
              expect(diary.hasRecords).toBe(true);
              expect(diary.records).toEqual([
                forgottenRecord,
                plannedRecord2,
                newRecord,
              ]);
              expect(diary.records).toHaveLength(3);
            });

            test('should change record value of updated record', () => {
              expect(diary.getRecordValueAt(plannedRecord2.day)).toBe(
                plannedRecord2.value
              );
            });

            test('should return diary to idle state', () => {
              expect(diary.state).toBe('idle');
            });
          });
        });

        context('next and previous record values change', () => {
          context('when new value is similar', () => {
            beforeEach(() => {
              result = diary.updateRecord({
                record: forgottenRecord,
                newRecord: plannedRecord1,
              });
            });

            test('should return unsuccessful result', () => {
              expect(result).toEqual({
                done: false,
                error: {
                  newMockRecord: [],
                  mockRecord: [errors.recordDuplicate().message],
                },
              });
            });

            test('should leave records unchanged', () => {
              expect(diary.hasRecords).toBe(true);
              expect(diary.records).toEqual([
                forgottenRecord,
                record2,
                newRecord,
              ]);
              expect(diary.records).toHaveLength(3);
            });

            test('should return diary to idle state', () => {
              expect(diary.state).toBe('idle');
            });
          });

          context('when new value is different', () => {
            beforeEach(() => {
              result = diary.updateRecord({
                record: forgottenRecord,
                newRecord: plannedRecord3,
              });
            });

            test('should return successful result', () => {
              expect(result).toEqual({ done: true, error: null });
            });

            test('should change records', () => {
              expect(diary.hasRecords).toBe(true);
              expect(diary.records).toEqual([
                record2,
                plannedRecord3,
                newRecord,
              ]);
              expect(diary.records).toHaveLength(3);
            });

            test('should change start day', () => {
              expect(diary.startDay).toBe(record2.day);
            });

            test('should change record value of updated record', () => {
              expect(diary.getRecordValueAt(plannedRecord3.day)).toBe(
                plannedRecord3.value
              );
            });

            test('should return diary to idle state', () => {
              expect(diary.state).toBe('idle');
            });
          });
        });
      });

      context('when change record of closed diary', () => {
        beforeEach(() => {
          result = diary.updateRecord({
            record: record1,
            newRecord: newRecord,
          });
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            error: {
              newMockRecord: [],
              mockRecord: [errors.diaryClosed().message],
            },
          });
        });

        test('should leave records unchanged', () => {
          expect(diary.hasRecords).toBe(true);
          expect(diary.records).toEqual([record2]);
          expect(diary.records).toHaveLength(0);
        });
      });
    });

    describe('#setRecords', () => {});

    describe('#addCloseRecord', () => {
      context('when passed day later than last record', () => {
        beforeEach(() => {
          result = diary.addCloseRecord(day8);
        });

        test('should return successful result', () => {
          expect(result).toEqual({ done: true, error: null });
        });

        test('should make diary closed', () => {
          expect(diary.isClosed).toBe(true);
          expect(diary.isStarted).toBe(false);
        });

        test('should change records', () => {
          expect(diary.hasRecords).toBe(false);
          expect(diary.records).toEqual([]);
        });

        test('should set record value undefined', () => {
          expect(diary.recordValue).toBeUndefined();
        });

        test('should set start day undefined', () => {
          expect(diary.startDay).toBeUndefined();
        });

        test('should set close day undefined', () => {
          expect(diary._closeDay).toBeUndefined();
        });
      });

      context('when passed day sooner than last record', () => {
        beforeEach(() => {
          result = diary.addCloseRecord(day5);
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            error: {
              mockRecord: [errors.diaryHasRecordsLater().message],
            },
          });
        });

        test('should leave diary started', () => {
          expect(diary.isStarted).toBe(true);
        });

        test('should leave records unchanged', () => {
          expect(diary.hasRecords).toBe(true);
          expect(diary.records).toEqual([record2]);
        });

        test('should leave record value unchanged', () => {
          expect(diary.recordValue).toBe(record2.value);
        });

        test('should leave start day unchanged', () => {
          expect(diary.startDay).toBe(record2.day);
        });

        test('should leave close day unchanged', () => {
          expect(diary._closeDay).toBeUndefined();
        });
      });
    });

    describe('#deleteCloseRecord', () => {
      beforeEach(() => {
        result = diary.deleteCloseRecord();
      });

      test('should return unsuccessful result', () => {
        expect(result).toEqual({
          done: false,
          error: {
            mockRecord: [errors.diaryNotClosed().message],
          },
        });
      });

      test('should leave diary started', () => {
        expect(diary.isStarted).toBe(true);
      });

      test('should leave records unchanged', () => {
        expect(diary.hasRecords).toBe(true);
        expect(diary.records).toEqual([record2]);
      });

      test('should leave record value unchanged', () => {
        expect(diary.recordValue).toBe(record2.value);
      });

      test('should leave start day unchanged', () => {
        expect(diary.startDay).toBe(record2.day);
      });

      test('should leave close day unchanged', () => {
        expect(diary._closeDay).toBeUndefined();
      });
    });

    describe('#updateCloseRecord', () => {
      beforeEach(() => {
        result = diary.updateCloseRecord(day1);
      });

      test('should return unsuccessful result', () => {
        expect(result).toEqual({
          done: false,
          error: {
            mockRecord: [errors.diaryNotClosed().message],
          },
        });
      });

      test('should leave diary started', () => {
        expect(diary.isStarted).toBe(true);
      });

      test('should leave records unchanged', () => {
        expect(diary.hasRecords).toBe(true);
        expect(diary.records).toEqual([record2]);
      });

      test('should leave record value unchanged', () => {
        expect(diary.recordValue).toBe(record2.value);
      });

      test('should leave start day unchanged', () => {
        expect(diary.startDay).toBe(record2.day);
      });

      test('should leave close day unchanged', () => {
        expect(diary._closeDay).toBeUndefined();
      });
    });
  });
});
