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

const closeValue = new MockRecord({ value: 'close' });

const record1 = new MockRecord({ value: 1, day: day1 });
const record2 = new MockRecord({ value: 2, day: day2 });
const closeRecord = new MockRecord({ value: closeValue, day: day4 });
const record3 = new MockRecord({ value: 3, day: day6 });

const recordWithSameDay = new MockRecord({ value: 4, day: record3.day });
const recordWithSameValue = new MockRecord({ value: record3.value, day: day7 });

const pastRecord = new MockRecord({ value: 5, day: day3 });
const forgottenRecord = new MockRecord({ value: 5, day: day5 });
const newRecord = new MockRecord({ value: 5, day: day7 });

const closedRecords = [record1, record2, closeRecord];
const records = [record1, record2, closeRecord, record3];
const nonExistentRecord = new MockRecord({
  value: 5,
  day: day4,
});

let diary;
let result;

describe('Domain :: lib :: Diary', () => {
  beforeEach(() => {
    diary = new Diary({ closeValue, RecordClass: MockRecord });
  });

  context('when passed regular record', () => {
    context('when diary is empty', () => {
      context('when initialized', () => {
        test('should records be empty', () => {
          expect(diary.records).toHaveLength(0);
          expect(diary.hasRecords).toBe(false);
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

        test('should be at idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });

      describe('#add', () => {
        beforeEach(() => {
          result = diary.addRecord({ record: record1 });
        });

        test('should return successful result', () => {
          expect(result).toEqual({ done: true, error: null });
        });

        test('should fill records', () => {
          expect(diary.hasRecords).toBe(true);
          expect(diary.records).toEqual([record1]);
          expect(diary.records).toHaveLength(1);
        });

        test('should set added record value', () => {
          expect(diary.recordValue).toBe(record1.value);
        });

        test('should set start day', () => {
          expect(diary.startDay).toBe(record1.day);
        });

        test('should return to idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });

      describe('#delete', () => {
        beforeEach(() => {
          result = diary.deleteRecord({ record: record1 });
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            error: { record: [errors.notFound] },
          });
        });

        test('should leave records unchanged', () => {
          expect(diary.hasRecords).toBe(false);
          expect(diary.records).toEqual([]);
          expect(diary.records).toHaveLength(0);
        });

        test('should return to idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });

      describe('#update', () => {
        beforeEach(() => {
          result = diary.updateRecord({ record: record1, newRecord: record2 });
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            error: {
              newRecord: [],
              record: [errors.notFound],
            },
          });
        });

        test('should leave records unchanged', () => {
          expect(diary.hasRecords).toBe(false);
          expect(diary.records).toEqual([]);
          expect(diary.records).toHaveLength(0);
        });

        test('should return to idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });

      describe('#set', () => {
        beforeEach(() => {
          result = diary.setRecords({ newRecords: records });
        });

        test('should return successful result', () => {
          expect(result).toEqual({ done: true, error: null });
        });

        test('should fill records', () => {
          expect(diary.hasRecords).toBe(true);
          expect(diary.records).toEqual([records[3]]);
          expect(diary.records).toHaveLength(1);
        });

        test('should set added record value', () => {
          expect(diary.recordValue).toBe(records[3].value);
        });

        test('should set start day', () => {
          expect(diary.recordDay).toBe(records[3].day);
        });

        test('should return to idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });
    });

    context('when diary have records', () => {
      beforeEach(() => {
        diary.setRecords({ newRecords: records });
      });

      context('when initialized', () => {
        test('should records be filled', () => {
          expect(diary.hasRecords).toBe(true);
          expect(diary.records).toEqual([records[3]]);
          expect(diary.records).toHaveLength(1);
        });

        test('should have record value not undefined', () => {
          expect(diary.recordValue).toBe(records[3].value);
        });

        test('should have start day', () => {
          expect(diary.startDay).toBe(records[3].day);
        });

        test('should be at idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });

      describe('#add', () => {
        context('when diary already have record at passed day', () => {
          beforeEach(() => {
            result = diary.addRecord({ record: recordWithSameDay });
          });
          test('should return unsuccessful result', () => {
            expect(result).toEqual({
              done: false,
              error: { record: [errors.alreadyDefined] },
            });
          });

          test('should leave records unchanged', () => {
            expect(diary.hasRecords).toBe(true);
            expect(diary.records).toEqual([record3]);
            expect(diary.records).toHaveLength(1);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });

        context('when diary already have record with passed value', () => {
          beforeEach(() => {
            result = diary.addRecord({ record: recordWithSameValue });
          });

          test('should return unsuccessful result', () => {
            expect(result).toEqual({
              done: false,
              error: { record: [errors.alreadyDefined] },
            });
          });

          test('should leave records unchanged', () => {
            expect(diary.hasRecords).toBe(true);
            expect(diary.records).toEqual([record3]);
            expect(diary.records).toHaveLength(1);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });

        context('when passed record of closed diary', () => {
          beforeEach(() => {
            result = diary.addRecord({ record: pastRecord });
          });

          test('should return unsuccessful result', () => {
            expect(result).toEqual({
              done: false,
              error: { record: [errors.diaryAlreadyClosed] },
            });
          });

          test('should leave records unchanged', () => {
            expect(diary.hasRecords).toBe(true);
            expect(diary.records).toEqual([record3]);
            expect(diary.records).toHaveLength(1);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });

        context('when diary has been closed', () => {
          beforeEach(() => {
            result = diary.addRecord({ record: forgottenRecord });
          });

          test('should return successful result', () => {
            expect(result).toEqual({
              done: true,
              error: { record: [] },
            });
          });

          test('should change records', () => {
            expect(diary.hasRecords).toBe(true);
            expect(diary.records).toEqual([forgottenRecord, record3]);
            expect(diary.records).toHaveLength(2);
          });

          test('should leave record value unchanged', () => {
            expect(diary.recordValue).toBe(record3.value);
          });

          test('should change start day', () => {
            expect(diary.startDay).toBe(forgottenRecord.day);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });

        context('when passed new record', () => {
          beforeEach(() => {
            result = diary.addRecord({ record: newRecord });
          });

          test('should return successful result', () => {
            expect(result).toEqual({
              done: true,
              error: { record: [] },
            });
          });

          test('should change records', () => {
            expect(diary.hasRecords).toBe(true);
            expect(diary.records).toEqual([record3, newRecord]);
            expect(diary.records).toHaveLength(2);
          });

          test('should change record value', () => {
            expect(diary.recordValue).toBe(newRecord.value);
          });

          test('should leave start day unchanged', () => {
            expect(diary.startDay).toBe(record3.day);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });
      });

      describe('#delete', () => {
        context('when passed non-existent record', () => {});
        context('when passed existing record', () => {});
        context('when passed record of closed diary', () => {});
        context('when diary has been closed', () => {});
      });

      describe('#update', () => {});

      describe('#set', () => {});
    });
  });

  context('when passed close record', () => {
    describe('#add', () => {
      beforeEach(() => {
        result = diary.addRecord({ record: closeRecord });
      });

      test('should return unsuccessful result', () => {
        expect(result).toEqual({
          done: false,
          error: {
            record: [errors.operationsWithCloseRecordNotPermitted],
          },
        });
      });

      test('should leave records unchanged', () => {
        expect(diary.hasRecords).toBe(false);
        expect(diary.records).toEqual([]);
        expect(diary.records).toHaveLength(0);
      });

      test('should return to idle state', () => {
        expect(diary.state).toBe('idle');
      });
    });

    describe('#delete', () => {
      beforeEach(() => {
        result = diary.deleteRecord({ record: closeRecord });
      });

      test('should return unsuccessful result', () => {
        expect(result).toEqual({
          done: false,
          error: {
            newRecord: [],
            record: [errors.notFound],
          },
        });
      });

      test('should leave records unchanged', () => {
        expect(diary.hasRecords).toBe(false);
        expect(diary.records).toEqual([]);
        expect(diary.records).toHaveLength(0);
      });

      test('should return to idle state', () => {
        expect(diary.state).toBe('idle');
      });
    });

    describe('#update', () => {
      context('when passed as record to update', () => {
        beforeEach(() => {
          result = diary.updateRecord({
            record: closeRecord,
            newRecord: record1,
          });
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            error: {
              newRecord: [],
              record: [errors.notFound],
            },
          });
        });

        test('should leave records unchanged', () => {
          expect(diary.hasRecords).toBe(false);
          expect(diary.records).toEqual([]);
          expect(diary.records).toHaveLength(0);
        });

        test('should return to idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });

      context('when passed as new record', () => {
        beforeEach(() => {
          result = diary.updateRecord({
            record: closeRecord,
            newRecord: record1,
          });
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            error: {
              newRecord: [errors.notFound],
              record: [],
            },
          });
        });

        test('should leave records unchanged', () => {
          expect(diary.hasRecords).toBe(false);
          expect(diary.records).toEqual([]);
          expect(diary.records).toHaveLength(0);
        });

        test('should return to idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });
    });
  });
});
