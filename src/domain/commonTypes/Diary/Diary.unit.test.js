import { BaseValue } from '../../_lib';
import { Diary } from './Diary';
import { Day } from '../Day';

class MockRecord extends BaseValue {
  constructor({ value, day }) {
    super();
    this.value = value;
    this.day = day;
  }
}

const day1 = new Day({ value: new Date('2017.01.01 00:00:00.000+08:00') });
const day2 = new Day({ value: new Date('2017.02.01 00:00:00.000+08:00') });
const day3 = new Day({ value: new Date('2017.03.01 00:00:00.000+08:00') });
const day4 = new Day({ value: new Date('2017.04.01 00:00:00.000+08:00') });
const day5 = new Day({ value: new Date('2017.05.01 00:00:00.000+08:00') });
const day6 = new Day({ value: new Date('2017.06.01 00:00:00.000+08:00') });
const day7 = new Day({ value: new Date('2017.07.01 00:00:00.000+08:00') });
const day8 = new Day({ value: new Date('2017.08.01 00:00:00.000+08:00') });
const day9 = new Day({ value: new Date('2017.09.01 00:00:00.000+08:00') });
const day = new Day();

const closeValue = 'CloseValue';
const pastValue1 = 'pastValue1';
const value1 = 'value1';
const value2 = 'value2';
const newValue = 'newValue';

const pastRecord1 = new MockRecord({ value: pastValue1, day: day1 });
const closeRecord = new MockRecord({ value: closeValue, day: day3 });
const record1 = new MockRecord({ value: value1, day: day5 });
const record2 = new MockRecord({ value: value2, day: day7 });
const record3 = new MockRecord({ value: value1, day: day9 });
const newRecord = new MockRecord({ value: newValue, day: day8 });
const newRecordFromScope = new MockRecord({
  value: newValue,
  day: day,
});
const newRecordWithSameDay = new MockRecord({
  value: newValue,
  day: day9,
});
const newRecordWithSameValue = new MockRecord({
  value: value1,
  day: day8,
});
// const forgottenRecord = new MockRecord({ value: forgottenValue, day: day });
const nonExistentRecord = new MockRecord({
  value: newValue,
  day: day6,
});
const newPastRecord = new MockRecord({ value: newValue, day: day2 });
const nonExistentPastRecord = new MockRecord({
  value: newValue,
  day: day2,
});

let diary;

describe('Domain :: commonTypes :: Diary', () => {
  context('when diary is new', () => {
    beforeEach(() => {
      diary = new Diary({ closeValue, RecordClass: MockRecord, records: [] });
    });

    describe('#addRecord', () => {
      context('when passed record', () => {
        test('should change records', () => {
          diary.addRecord({ record: record1 });

          expect(diary.records).toEqual([record1]);
        });
      });
    });

    describe('#deleteRecords', () => {
      context('when passed any record', () => {
        test('should throw exception and leave records unchanged', () => {
          try {
            diary.deleteRecord({ record: nonExistentRecord });
          } catch (e) {
            expect(e.message).toBe('RECORD_NOT_FOUND');
            expect(diary._records).toHaveLength(0);
          }
        });
      });
    });

    describe('#updateRecord', () => {
      context('when passed any record', () => {
        test('should throw exception and leave records unchanged', () => {
          try {
            diary.updateRecord({
              record: nonExistentRecord,
              newRecord: newRecord,
            });
          } catch (e) {
            expect(e.message).toBe('RECORD_NOT_FOUND');
            expect(diary._records).toHaveLength(0);
          }
        });
      });
    });

    describe('#addCloseRecord', () => {
      context('when passed any day', () => {
        test('should throw exception and leave records unchanged', () => {
          try {
            diary.addCloseRecord({ day: day1 });
          } catch (e) {
            expect(e.message).toBe('DIARY_NOT_STARTED');
            expect(diary._records).toHaveLength(0);
          }
        });
      });
    });

    describe('#deleteCloseRecord', () => {
      test('should throw exception and leave records unchanged', () => {
        try {
          diary.deleteCloseRecord();
        } catch (e) {
          expect(e.message).toBe('DIARY_NOT_CLOSED');
          expect(diary._records).toHaveLength(0);
        }
      });
    });

    describe('#updateCloseRecord', () => {
      context('when passed any day', () => {
        test('should throw exception and leave records unchanged', () => {
          try {
            diary.updateCloseRecord({ day: day1 });
          } catch (e) {
            expect(e.message).toBe('DIARY_NOT_CLOSED');
            expect(diary._records).toHaveLength(0);
          }
        });
      });
    });
  });

  context('when diary is started', () => {
    beforeEach(() => {
      diary = new Diary({
        closeValue,
        RecordClass: MockRecord,
        records: [pastRecord1, closeRecord, record1, record2, record3],
      });
    });

    describe('#addRecord', () => {
      context('when passed record with existing day', () => {
        test('should throw exception and leave records unchanged', () => {
          try {
            diary.addRecord({ record: newRecordWithSameDay });
          } catch (e) {
            expect(e.message).toBe('RECORD_ALREADY_EXISTS');
            expect(diary._records).toEqual([
              pastRecord1,
              closeRecord,
              record1,
              record2,
              record3,
            ]);
          }
        });
      });

      context('when passed record with equal value', () => {
        test('should throw exception and leave records unchanged', () => {
          try {
            diary.addRecord({ record: newRecordWithSameValue });
          } catch (e) {
            expect(e.message).toBe('RECORD_DUPLICATE');
            expect(diary._records).toEqual([
              pastRecord1,
              closeRecord,
              record1,
              record2,
              record3,
            ]);
          }
        });
      });

      context('when passed new record', () => {
        test('should change records', () => {
          diary.addRecord({ record: newRecord });
          expect(diary._records).toEqual([
            pastRecord1,
            closeRecord,
            record1,
            record2,
            record3,
            newRecord,
          ]);
        });
      });

      context('when passed record with day sooner than close day', () => {
        test('should throw exception and leave records unchanged', () => {
          try {
            diary.addRecord({ record: newPastRecord });
          } catch (e) {
            expect(e.message).toBe('DIARY_CLOSED');
            expect(diary._records).toEqual([
              pastRecord1,
              closeRecord,
              record1,
              record2,
              record3,
            ]);
          }
        });
      });
    });

    describe('#deleteRecords', () => {
      context('when passed non-existent record', () => {
        test('should throw exception and leave records unchanged', () => {
          try {
            diary.deleteRecord({ record: nonExistentRecord });
          } catch (e) {
            expect(e.message).toBe('RECORD_NOT_FOUND');
            expect(diary._records).toEqual([
              pastRecord1,
              closeRecord,
              record1,
              record2,
              record3,
            ]);
          }
        });
      });

      context('when passed record with equal neighbor records', () => {
        test('should throw exception and leave records unchanged', () => {
          try {
            diary.deleteRecord({ record: record2 });
          } catch (e) {
            expect(e.message).toBe('RECORD_HAS_EQUAL_NEIGHTBORS');
            expect(diary._records).toEqual([
              pastRecord1,
              closeRecord,
              record1,
              record2,
              record3,
            ]);
          }
        });
      });

      context('when passed record with day sooner than close day', () => {
        test('should throw exception and leave records unchanged', () => {
          try {
            diary.deleteRecord({ record: nonExistentPastRecord });
          } catch (e) {
            expect(e.message).toBe('DIARY_CLOSED');
            expect(diary._records).toEqual([
              pastRecord1,
              closeRecord,
              record1,
              record2,
              record3,
            ]);
          }
        });
      });

      context('when passed record without equal neighbor records', () => {
        test('should change records', () => {
          diary.deleteRecord({ record: record1 });
          expect(diary._records).toEqual([
            pastRecord1,
            closeRecord,
            record2,
            record3,
          ]);
        });
      });
    });

    describe('#updateRecord', () => {
      context('when passed non-existent record', () => {
        test('should throw exception and leave records unchanged', () => {
          try {
            diary.updateRecord({
              record: nonExistentRecord,
              newRecord: newRecord,
            });
          } catch (e) {
            expect(e.message).toBe('RECORD_NOT_FOUND');
            expect(diary._records).toEqual([
              pastRecord1,
              closeRecord,
              record1,
              record2,
              record3,
            ]);
          }
        });
      });

      context('when passed record with existing day', () => {
        test('should throw exception and leave records unchanged', () => {
          try {
            diary.updateRecord({
              record: record3,
              newRecord: newRecordWithSameDay,
            });
          } catch (e) {
            expect(e.message).toBe('RECORD_ALREADY_EXISTS');
            expect(diary._records).toEqual([
              pastRecord1,
              closeRecord,
              record1,
              record2,
              record3,
            ]);
          }
        });
      });

      context('when passed record with equal value', () => {
        test('should throw exception and leave records unchanged', () => {
          diary.updateRecord({
            record: record3,
            newRecord: newRecordWithSameValue,
          });
          try {
          } catch (e) {
            expect(e.message).toBe('RECORD_DUPLICATE');
            expect(diary._records).toEqual([
              pastRecord1,
              closeRecord,
              record1,
              record2,
              record3,
            ]);
          }
        });
      });

      context(
        'when passed record with equal neighbor records and new record with day outside',
        () => {
          test('should throw exception and leave records unchanged', () => {
            try {
              diary.updateRecord({
                record: record2,
                newRecord: newRecordFromScope,
              });
            } catch (e) {
              expect(e.message).toBe('RECORD_HAS_LIMITED_SCOPE');
              expect(diary._records).toEqual([
                pastRecord1,
                closeRecord,
                record1,
                record2,
                record3,
              ]);
            }
          });
        }
      );

      context(
        'when passed record with equal neighbor records and new record with day within',
        () => {
          test('should change passed record', () => {
            diary.updateRecord({ record: record2, newRecord: newRecord });
            expect(diary._records).toEqual([
              pastRecord1,
              closeRecord,
              record1,
              newRecord,
              record3,
            ]);
          });
        }
      );

      context('when passed records with day sooner than close day ', () => {
        test('should throw exception and leave records unchanged', () => {
          try {
            diary.updateRecord({ record: pastRecord1, newRecord: newRecord });
          } catch (e) {
            expect(e.message).toBe('DIARY_CLOSED');
            expect(diary._records).toEqual([
              pastRecord1,
              closeRecord,
              record1,
              record2,
              record3,
            ]);
          }
        });
      });

      context(
        'when passed record and new record without equal neighbor records',
        () => {
          test('should change passed record', () => {
            diary.updateRecord({ record: record1, newRecord: newRecord });
            expect(diary._records).toEqual([
              pastRecord1,
              closeRecord,
              record1,
              record2,
              record3,
            ]);
          });
        }
      );
    });

    describe('#addCloseRecord', () => {
      context('when passed day is later than latest record day', () => {
        test('should change records', () => {
          diary.addCloseRecord({ day });
          expect(diary._records).toEqual([
            pastRecord1,
            closeRecord,
            record1,
            record2,
            record3,
            closeRecord,
          ]);
        });
      });

      context('when passed day is sooner than latest record day', () => {
        test('should throw exception and leave records unchanged', () => {
          try {
            diary.addCloseRecord({ day: day1 });
          } catch (e) {
            expect(e.message).toBe('DIARY_HAS_RECORDS_LATER');
            expect(diary._records).toEqual([
              pastRecord1,
              closeRecord,
              record1,
              record2,
              record3,
            ]);
          }
        });
      });
    });

    describe('#deleteCloseRecord', () => {
      test('should throw exception and leave records unchanged', () => {
        try {
          diary.deleteCloseRecord();
        } catch (e) {
          expect(e.message).toBe('DIARY_NOT_CLOSED');
          expect(diary._records).toEqual([
            pastRecord1,
            closeRecord,
            record1,
            record2,
            record3,
          ]);
        }
      });
    });

    describe('#updateCloseRecord', () => {
      context('when passed any day', () => {
        test('should throw exception and leave records unchanged', () => {
          try {
            diary.updateCloseRecord({ day: day1 });
          } catch (e) {
            expect(e.message).toBe('DIARY_NOT_CLOSED');
            expect(diary._records).toEqual([
              pastRecord1,
              closeRecord,
              record1,
              record2,
              record3,
            ]);
          }
        });
      });
    });
  });

  context('when diary is closed', () => {
    beforeEach(() => {
      diary = new Diary({
        closeValue,
        RecordClass: MockRecord,
        records: [pastRecord1, closeRecord],
      });
    });

    describe('#addRecord', () => {
      context('when diary have no record like new record', () => {
        test('should change records', () => {
          diary.addRecord({ record: record1 });
          expect(diary._records).toEqual([pastRecord1, closeRecord, record1]);
        });
      });

      context('when passed record with day sooner than close day', () => {
        test('should throw exception and leave records unchanged', () => {
          try {
            diary.addRecord({ record: newPastRecord });
          } catch (e) {
            expect(e.message).toBe('DIARY_CLOSED');
            expect(diary._records).toEqual([pastRecord1, closeRecord]);
          }
        });
      });
    });

    describe('#deleteRecords', () => {
      context('when passed non-existent record', () => {
        test('should throw exception and leave records unchanged', () => {
          try {
            diary.deleteRecord({ record: nonExistentRecord });
          } catch (e) {
            expect(e.message).toBe('RECORD_NOT_FOUND');
            expect(diary._records).toEqual([pastRecord1, closeRecord]);
          }
        });
      });

      context('when passed record with day sooner than close day ', () => {
        test('should throw exception and leave records unchanged', () => {
          try {
            diary.deleteRecord({ record: nonExistentPastRecord });
          } catch (e) {
            expect(e.message).toBe('DIARY_CLOSED');
            expect(diary._records).toEqual([pastRecord1, closeRecord]);
          }
        });
      });
    });

    describe('#updateRecord', () => {
      context('when passed non-existent record', () => {
        test('should throw exception and leave records unchanged', () => {
          try {
            diary.updateRecord({
              record: nonExistentRecord,
              newRecord: newRecord,
            });
          } catch (e) {
            expect(e.message).toBe('RECORD_NOT_FOUND');
            expect(diary._records).toEqual([pastRecord1, closeRecord]);
          }
        });
      });

      context('when passed records with day sooner than close day ', () => {
        test('should throw exception and leave records unchanged', () => {
          try {
            diary.updateRecord({
              record: nonExistentPastRecord,
              newRecord: newRecord,
            });
          } catch (e) {
            expect(e.message).toBe('DIARY_CLOSED');
            expect(diary._records).toEqual([pastRecord1, closeRecord]);
          }
        });
      });
    });

    describe('#addCloseRecord', () => {
      context('when passed any day', () => {
        test('should throw exception and leave records unchanged', () => {
          try {
            diary.addCloseRecord({ day: day1 });
          } catch (e) {
            expect(e.message).toBe('DIARY_NOT_STARTED');
            expect(diary._records).toEqual([pastRecord1, closeRecord]);
          }
        });
      });
    });

    describe('#deleteCloseRecord', () => {
      test('should restore records', () => {
        diary.deleteCloseRecord();
        expect(diary._records).toEqual([pastRecord1, closeRecord]);
      });
    });

    describe('#updateCloseRecord', () => {
      context('when passed day is sooner than latest record day', () => {
        test('should throw exception and leave records unchanged', () => {
          try {
            diary.updateCloseRecord({ day: day1 });
          } catch (e) {
            expect(e.message).toBe('DIARY_HAS_RECORDS_LATER');
            expect(diary._records).toEqual([pastRecord1, closeRecord]);
          }
        });
      });

      context('when passed day is later than latest record day', () => {
        test('should update close day', () => {
          diary.updateCloseRecord({ day: day9 });
          expect(diary._records).toEqual([pastRecord1, closeRecord]);
        });
      });
    });
  });
});
