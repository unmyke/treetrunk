import { BaseValue } from '../../_lib';
import { Diary } from './Diary';
import { Day } from '../Day';

class MockRecord extends BaseValue {
  static valuePropName = 'value';

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

const closeValue = 'closeValue';
const pastValue1 = 'pastValue1';
const value1 = 'value1';
const value2 = 'value2';
const newValue = 'newValue';

const pastRecord1 = new MockRecord({ value: pastValue1, day: day1 });
const closeRecord = new MockRecord({ value: closeValue, day: day3 });
const record1 = new MockRecord({ value: value1, day: day5 });
const record2 = new MockRecord({ value: value2, day: day7 });
const record3 = new MockRecord({ value: value1, day: day9 });
const newRecord = new MockRecord({ value: newValue, day: day4 });
const newRecordFromScope = new MockRecord({
  value: newValue,
  day: day8,
});
const newRecordWithSameDay = new MockRecord({
  value: newValue,
  day: day5,
});
const newRecordWithSameValue = new MockRecord({
  value: value1,
  day: day6,
});
const newPastRecord = new MockRecord({ value: newValue, day: day2 });

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
          expect(() => {
            diary.deleteRecord({ record: newRecord });
          }).toThrowError('DIARY_NOT_STARTED');

          expect(diary._records).toHaveLength(0);
        });
      });
    });

    describe('#updateRecord', () => {
      context('when passed any record', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateRecord({
              record: record1,
              newRecord: newRecord,
            });
          }).toThrowError('DIARY_NOT_STARTED');

          expect(diary._records).toHaveLength(0);
        });
      });
    });

    describe('#addCloseRecord', () => {
      context('when passed any day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.addCloseRecord({ day: day1 });
          }).toThrowError('DIARY_NOT_STARTED');

          expect(diary._records).toHaveLength(0);
        });
      });
    });

    describe('#deleteCloseRecord', () => {
      test('should throw exception and leave records unchanged', () => {
        expect(() => {
          diary.deleteCloseRecord();
        }).toThrowError('DIARY_NOT_CLOSED');

        expect(diary._records).toHaveLength(0);
      });
    });

    describe('#updateCloseRecord', () => {
      context('when passed any day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateCloseRecord({ day: day1 });
          }).toThrowError('DIARY_NOT_CLOSED');

          expect(diary._records).toHaveLength(0);
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
          expect(() => {
            diary.addRecord({ record: newRecordWithSameDay });
          }).toThrowError('RECORD_ALREADY_EXISTS');

          expect(diary._records).toEqual([
            pastRecord1,
            closeRecord,
            record1,
            record2,
            record3,
          ]);
        });
      });

      context('when passed record with equal value', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.addRecord({ record: newRecordWithSameValue });
          }).toThrowError('RECORD_DUPLICATE');

          expect(diary._records).toEqual([
            pastRecord1,
            closeRecord,
            record1,
            record2,
            record3,
          ]);
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
          expect(() => {
            diary.addRecord({ record: newPastRecord });
          }).toThrowError('DIARY_CLOSED');

          expect(diary._records).toEqual([
            pastRecord1,
            closeRecord,
            record1,
            record2,
            record3,
          ]);
        });
      });
    });

    describe('#deleteRecords', () => {
      context('when passed non-existent record', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.deleteRecord({ record: newRecord });
          }).toThrowError('RECORD_NOT_FOUND');

          expect(diary._records).toEqual([
            pastRecord1,
            closeRecord,
            record1,
            record2,
            record3,
          ]);
        });
      });

      context('when passed record with equal neighbor records', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.deleteRecord({ record: record2 });
          }).toThrowError('RECORD_HAS_EQUAL_NEIGHTBORS');

          expect(diary._records).toEqual([
            pastRecord1,
            closeRecord,
            record1,
            record2,
            record3,
          ]);
        });
      });

      context('when passed record with day sooner than close day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.deleteRecord({ record: newPastRecord });
          }).toThrowError('DIARY_CLOSED');

          expect(diary._records).toEqual([
            pastRecord1,
            closeRecord,
            record1,
            record2,
            record3,
          ]);
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
          expect(() => {
            diary.updateRecord({
              record: newRecord,
              newRecord: newRecord,
            });
          }).toThrowError('RECORD_NOT_FOUND');

          expect(diary._records).toEqual([
            pastRecord1,
            closeRecord,
            record1,
            record2,
            record3,
          ]);
        });
      });

      context('when passed record with existing day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateRecord({
              record: record3,
              newRecord: newRecordWithSameDay,
            });
          }).toThrowError('RECORD_ALREADY_EXISTS');

          expect(diary._records).toEqual([
            pastRecord1,
            closeRecord,
            record1,
            record2,
            record3,
          ]);
        });
      });

      context('when passed record with equal value', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateRecord({
              record: record3,
              newRecord: newRecordWithSameValue,
            });
          }).toThrowError('RECORD_DUPLICATE');

          expect(diary._records).toEqual([
            pastRecord1,
            closeRecord,
            record1,
            record2,
            record3,
          ]);
        });
      });

      context(
        'when passed record with equal neighbor records and new record with day outside',
        () => {
          test('should throw exception and leave records unchanged', () => {
            expect(() => {
              diary.updateRecord({
                record: record2,
                newRecord,
              });
            }).toThrowError('RECORD_HAS_LIMITED_SCOPE');

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

      context(
        'when passed record with equal neighbor records and new record with day within',
        () => {
          test('should change passed record', () => {
            diary.updateRecord({
              record: record2,
              newRecord: newRecordFromScope,
            });
            expect(diary._records).toEqual([
              pastRecord1,
              closeRecord,
              record1,
              record3,
              newRecordFromScope,
            ]);
          });
        }
      );

      context('when passed records with day sooner than close day ', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateRecord({ record: pastRecord1, newRecord: newRecord });
          }).toThrowError('DIARY_CLOSED');

          expect(diary._records).toEqual([
            pastRecord1,
            closeRecord,
            record1,
            record2,
            record3,
          ]);
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
              record2,
              record3,
              newRecord,
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
            new MockRecord({ value: closeValue, day }),
          ]);
        });
      });

      context('when passed day is sooner than latest record day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.addCloseRecord({ day: day1 });
          }).toThrowError('DIARY_HAS_RECORDS_LATER');

          expect(diary._records).toEqual([
            pastRecord1,
            closeRecord,
            record1,
            record2,
            record3,
          ]);
        });
      });
    });

    describe('#deleteCloseRecord', () => {
      test('should throw exception and leave records unchanged', () => {
        expect(() => {
          diary.deleteCloseRecord();
        }).toThrowError('DIARY_NOT_CLOSED');

        expect(diary._records).toEqual([
          pastRecord1,
          closeRecord,
          record1,
          record2,
          record3,
        ]);
      });
    });

    describe('#updateCloseRecord', () => {
      context('when passed any day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateCloseRecord({ day: day1 });
          }).toThrowError('DIARY_NOT_CLOSED');

          expect(diary._records).toEqual([
            pastRecord1,
            closeRecord,
            record1,
            record2,
            record3,
          ]);
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
          expect(() => {
            diary.addRecord({ record: newPastRecord });
          }).toThrowError('DIARY_CLOSED');

          expect(diary._records).toEqual([pastRecord1, closeRecord]);
        });
      });
    });

    describe('#deleteRecords', () => {
      context('when passed non-existent record', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.deleteRecord({ record: newRecord });
          }).toThrowError('DIARY_NOT_STARTED');

          expect(diary._records).toEqual([pastRecord1, closeRecord]);
        });
      });

      context('when passed record with day sooner than close day ', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.deleteRecord({ record: newPastRecord });
          }).toThrowError('DIARY_NOT_STARTED');

          expect(diary._records).toEqual([pastRecord1, closeRecord]);
        });
      });
    });

    describe('#updateRecord', () => {
      context('when passed non-existent record', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateRecord({
              record: newRecord,
              newRecord: newRecord,
            });
          }).toThrowError('DIARY_NOT_STARTED');

          expect(diary._records).toEqual([pastRecord1, closeRecord]);
        });
      });

      context('when passed records with day sooner than close day ', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateRecord({
              record: newPastRecord,
              newRecord: newRecord,
            });
          }).toThrowError('DIARY_NOT_STARTED');

          expect(diary._records).toEqual([pastRecord1, closeRecord]);
        });
      });
    });

    describe('#addCloseRecord', () => {
      context('when passed any day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.addCloseRecord({ day: day1 });
          }).toThrowError('DIARY_NOT_STARTED');

          expect(diary._records).toEqual([pastRecord1, closeRecord]);
        });
      });
    });

    describe('#deleteCloseRecord', () => {
      test('should restore records', () => {
        diary.deleteCloseRecord();
        expect(diary._records).toEqual([pastRecord1]);
      });
    });

    describe('#updateCloseRecord', () => {
      context('when passed day is sooner than latest record day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateCloseRecord({ day: day1 });
          }).toThrowError('DIARY_HAS_RECORDS_LATER');

          expect(diary._records).toEqual([pastRecord1, closeRecord]);
        });
      });

      context('when passed day is later than latest record day', () => {
        test('should update close day', () => {
          diary.updateCloseRecord({ day: day9 });
          expect(diary._records).toEqual([
            pastRecord1,
            new MockRecord({ value: closeValue, day: day9 }),
          ]);
        });
      });
    });
  });
});
