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

const newRecord = new MockRecord({ value: 5, day: day5 });

const closedRecords = [record1, record2, closeRecord];
const records = [record1, record2, closeRecord, record3];
const forgottenRecord = new MockRecord({ value: 4, day: day3 });

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
          expect(diary._records).toHaveLength(0);
          expect(diary._hasRecords).toBe(false);
        });

        test('should have record value undefined', () => {
          expect(diary._recordValue).toBeUndefined();
        });

        test('should have start day undefined', () => {
          expect(diary._startDay).toBeUndefined();
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
          result = diary._addRecord({ record: record1 });
        });

        test('should return successful result', () => {
          expect(result).toEqual({ done: true, error: null });
        });

        test('should fill records', () => {
          expect(diary._hasRecords).toBe(true);
          expect(diary._records).toEqual([record1]);
          expect(diary._records).toHaveLength(1);
        });

        test('should set added record value', () => {
          expect(diary._recordValue).toBe(record1.value);
        });

        test('should set start day', () => {
          expect(diary._startDay).toBe(record1.day);
        });

        test('should return to idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });

      describe('#delete', () => {
        beforeEach(() => {
          result = diary._deleteRecord({ record: record1 });
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            error: { record: [errors.notFound] },
          });
        });

        test('should leave records unchanged', () => {
          expect(diary._hasRecords).toBe(false);
          expect(diary._records).toEqual([]);
          expect(diary._records).toHaveLength(0);
        });

        test('should return to idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });

      describe('#update', () => {
        beforeEach(() => {
          result = diary._updateRecord({ record: record1, newRecord: record2 });
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
          expect(diary._hasRecords).toBe(false);
          expect(diary._records).toEqual([]);
          expect(diary._records).toHaveLength(0);
        });

        test('should return to idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });

      describe('#set', () => {
        beforeEach(() => {
          result = diary._setRecords({ newRecords: records });
        });

        test('should return successful result', () => {
          expect(result).toEqual({ done: true, error: null });
        });

        test('should fill records', () => {
          expect(diary._hasRecords).toBe(true);
          expect(diary._records).toEqual([records[3]]);
          expect(diary._records).toHaveLength(1);
        });

        test('should set added record value', () => {
          expect(diary._recordValue).toBe(records[3].value);
        });

        test('should set start day', () => {
          expect(diary._recordDay).toBe(records[3].day);
        });

        test('should return to idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });
    });

    context('when diary have records', () => {
      beforeEach(() => {
        diary._setRecords({ newRecords: records });
      });

      context('when initialized', () => {
        test('should records be filled', () => {
          expect(diary._hasRecords).toBe(true);
          expect(diary._records).toEqual([records[3]]);
          expect(diary._records).toHaveLength(1);
        });

        test('should have record value not undefined', () => {
          expect(diary._recordValue).toBe(records[3].value);
        });

        test('should have start day', () => {
          expect(diary._startDay).toBe(records[3].day);
        });

        test('should be at idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });

      describe('#add', () => {
        context('when passed existing record', () => {
          beforeEach(() => {
            result = diary._addRecord({ record: record3 });
          });

          test('should return unsuccessful result', () => {
            expect(result).toEqual({
              done: false,
              error: {
                newRecord: [],
                record: [errors.nothingToUpdate],
              },
            });
          });

          test('should leave records unchanged', () => {
            expect(diary._hasRecords).toBe(true);
            expect(diary._records).toEqual([records[3]]);
            expect(diary._records).toHaveLength(1);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });

        context('when diary already have record at passed day', () => {
          beforeEach(() => {
            result = diary._addRecord({ record: recordWithSameDay });
          });
          test('should return unsuccessful result', () => {
            expect(result).toEqual({
              done: false,
              error: { record: [errors.alreadyDefined] },
            });
          });

          test('should leave records unchanged', () => {
            expect(diary._hasRecords).toBe(true);
            expect(diary._records).toEqual([records[3]]);
            expect(diary._records).toHaveLength(1);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });

        context('when diary already have record with passed value', () => {
          beforeEach(() => {
            result = diary._addRecord({ record: recordWithSameValue });
          });

          test('should return unsuccessful result', () => {
            expect(result).toEqual({
              done: false,
              error: { record: [errors.alreadyDefined] },
            });
          });

          test('should leave records unchanged', () => {
            expect(diary._hasRecords).toBe(true);
            expect(diary._records).toEqual([records[3]]);
            expect(diary._records).toHaveLength(1);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });

        context('when passed record to closed diary', () => {
          beforeEach(() => {
            result = diary._addRecord(forgottenRecord);
          });

          test('should return unsuccessful result', () => {
            expect(result).toEqual({
              done: false,
              error: { record: [errors.alreadyDefined] },
            });
          });

          test('should leave records unchanged', () => {
            expect(diary._hasRecords).toBe(true);
            expect(diary._records).toEqual([records[3]]);
            expect(diary._records).toHaveLength(1);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });

        context('when passed new record', () => {});
      });

      describe('#delete', () => {
        context('when diary have record at passed day', () => {
          context('when previous and next records have same values', () => {});

          context(
            'when previous and next record values are not the same',
            () => {}
          );
        });

        context('when no record existed at diary', () => {
          beforeEach(() => {
            result = diary._deleteRecord({
              record: new MockRecord({
                value: 5,
                day: day4,
              }),
            });
          });

          test('should return unsuccessful result', () => {
            expect(result).toEqual({
              done: false,
              error: { record: [errors.notFound] },
            });
          });

          test('should leave records unchanged', () => {
            expect(diary._hasRecords).toBe(true);
            expect(diary._records).toEqual([record4]);
            expect(diary._records).toHaveLength(1);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });
      });

      describe('#update', () => {
        context('when record already exists at passed day', () => {});

        context('when no record exists at passed day', () => {});
      });

      describe('#set', () => {});
    });

    context('when diary is closed', () => {
      beforeEach(() => {
        diary._setRecords({ newRecords: closedRecords });
      });

      context('when initialized', () => {
        test('should records be empty', () => {
          expect(diary._hasRecords).toBe(false);
          expect(diary._records).toBe([]);
          expect(diary._records).toHaveLength(0);
        });

        test('should have record value undefined', () => {
          expect(diary._recordValue).toBeUndefined();
        });

        test('should have no start day', () => {
          expect(diary._startDay).toBeUndefined();
        });

        test('should be at idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });

      describe('#add', () => {
        context('when passed close record', () => {
          beforeEach(() => {
            result = diary._addRecord({ record: closeRecord });
          });

          test('should return unsuccessful result', () => {
            expect(result).toEqual({
              done: false,
              error: [
                `Mock record with value "${
                  closeRecord.value
                }" at 20.01.2017 already exists`,
              ],
            });
          });

          test('should leave records unchanged', () => {
            expect(diary._hasRecords).toBe(false);
            expect(diary._records).toEqual([]);
            expect(diary._records).toHaveLength(0);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });

        context('when passed not close record', () => {
          beforeEach(() => {
            result = diary._addRecord({ record: record4 });
          });

          test('should return successful result', () => {
            expect(result).toEqual({ done: true, error: null });
          });

          test('should fill records', () => {
            expect(diary._hasRecords).toBe(true);
            expect(diary._records).toEqual([record4]);
            expect(diary._records).toHaveLength(1);
          });

          test('should set added record value', () => {
            expect(diary._recordValue).toBe(record4.value);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });
      });

      describe('#delete', () => {
        context('when close record exists at passed day', () => {
          beforeEach(() => {
            result = diary._deleteRecord({ record: closeRecord });
          });

          test('should return successful result', () => {
            expect(result).toEqual({ done: true, error: null });
          });

          test('should restore records', () => {
            expect(diary._hasRecords).toBe(true);
            expect(diary._records).toEqual([record1, record2]);
            expect(diary._records).toHaveLength(2);
          });

          test('should set added record value', () => {
            expect(diary._recordValue).toBe(record2.value);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });

        context('when no close record exists at passed day', () => {
          beforeEach(() => {
            result = diary._deleteRecord({
              record: new MockRecord({
                value: closeValue,
                day: day4,
              }),
            });
          });

          test('should return unsuccessful result', () => {
            expect(result).toEqual({
              done: false,
              error: ['Mock record with value "close" at 20.04.2017 not found'],
            });
          });

          test('should leave records unchanged', () => {
            expect(diary._hasRecords).toBe(false);
            expect(diary._records).toEqual([]);
            expect(diary._records).toHaveLength(0);
          });

          test('should return to idle state', () => {
            expect(diary.state).toBe('idle');
          });
        });
      });

      describe('#update', () => {
        beforeEach(() => {
          result = diary._updateRecord({
            record: closeRecord,
            newRecord: record1,
          });
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            error: { newRecord: [], record: ['NOTHING_TO_UPDATE'] },
          });
        });

        test('should leave records unchanged', () => {
          expect(diary._hasRecords).toBe(false);
          expect(diary._records).toEqual([]);
          expect(diary._records).toHaveLength(0);
        });

        test('should return to idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });

      describe('#set', () => {});
    });
  });

  context('when passed close record', () => {
    describe('#add', () => {
      beforeEach(() => {
        result = diary._addRecord({ record: closeRecord });
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
        expect(diary._hasRecords).toBe(false);
        expect(diary._records).toEqual([]);
        expect(diary._records).toHaveLength(0);
      });

      test('should return to idle state', () => {
        expect(diary.state).toBe('idle');
      });
    });

    describe('#delete', () => {
      beforeEach(() => {
        result = diary._deleteRecord({ record: closeRecord });
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
        expect(diary._hasRecords).toBe(false);
        expect(diary._records).toEqual([]);
        expect(diary._records).toHaveLength(0);
      });

      test('should return to idle state', () => {
        expect(diary.state).toBe('idle');
      });
    });

    describe('#update', () => {
      context('when passed as record to update', () => {
        beforeEach(() => {
          result = diary._updateRecord({
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
          expect(diary._hasRecords).toBe(false);
          expect(diary._records).toEqual([]);
          expect(diary._records).toHaveLength(0);
        });

        test('should return to idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });

      context('when passed as new record', () => {
        beforeEach(() => {
          result = diary._updateRecord({
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
          expect(diary._hasRecords).toBe(false);
          expect(diary._records).toEqual([]);
          expect(diary._records).toHaveLength(0);
        });

        test('should return to idle state', () => {
          expect(diary.state).toBe('idle');
        });
      });
    });
  });
});
