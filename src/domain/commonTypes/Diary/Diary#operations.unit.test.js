import { BaseValue } from '../../_lib';
import { Diary } from './Diary';
import { Day } from '../Day';

class MockRecord extends BaseValue {
  static valuePropName = 'mockValue';

  constructor({ mockValue, day }) {
    super();
    this.mockValue = mockValue;
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

const pastValue1 = 'pastValue1';
const value1 = 'value1';
const value2 = 'value2';
const newValue = 'newValue';

const pastRecord1 = new MockRecord({ mockValue: pastValue1, day: day1 });
const record1 = new MockRecord({ mockValue: value1, day: day5 });
const record2 = new MockRecord({ mockValue: value2, day: day7 });
const record3 = new MockRecord({ mockValue: value1, day: day9 });
const newRecord = new MockRecord({ mockValue: newValue, day: day4 });
const newRecordFromScope = new MockRecord({
  mockValue: newValue,
  day: day8,
});
const newRecordWithSameDay = new MockRecord({
  mockValue: newValue,
  day: day5,
});
const newRecordWithSameValue = new MockRecord({
  mockValue: value1,
  day: day6,
});
const newPastRecord = new MockRecord({ mockValue: newValue, day: day2 });

let diary;

describe('Domain :: commonTypes :: Diary', () => {
  context('when diary is new', () => {
    beforeEach(() => {
      diary = Diary.restore(MockRecord, []);
    });

    describe('#addRecord', () => {
      context('when passed record', () => {
        test('should change records', () => {
          diary.addRecord(record1);

          expect(diary.records).toEqual([record1]);
        });
      });
    });

    describe('#deleteRecordAt', () => {
      context('when passed any record', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.deleteRecordAt(newRecord.day);
          }).toThrowError('DIARY_NOT_STARTED');

          expect(diary._records).toHaveLength(0);
        });
      });
    });

    describe('#updateRecordTo', () => {
      context('when passed any record', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateRecordTo(record1.day, newRecord);
          }).toThrowError('DIARY_NOT_STARTED');

          expect(diary._records).toHaveLength(0);
        });
      });
    });

    describe('#addCloseAt', () => {
      context('when passed any day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.addCloseAt(day1);
          }).toThrowError('DIARY_NOT_STARTED');

          expect(diary._records).toHaveLength(0);
        });
      });
    });

    describe('#deleteClose', () => {
      test('should throw exception and leave records unchanged', () => {
        expect(() => {
          diary.deleteClose();
        }).toThrowError('DIARY_NOT_CLOSED');

        expect(diary._records).toHaveLength(0);
      });
    });

    describe('#updateCloseTo', () => {
      context('when passed any day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateCloseTo(day1);
          }).toThrowError('DIARY_NOT_CLOSED');

          expect(diary._records).toHaveLength(0);
        });
      });
    });
  });

  context('when diary is started', () => {
    beforeEach(() => {
      diary = Diary.restore(
        MockRecord,
        [pastRecord1, record1, record2, record3],
        [day3]
      );
    });

    describe('#addRecord', () => {
      context('when passed record with existing day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.addRecord(newRecordWithSameDay);
          }).toThrowError('RECORD_ALREADY_EXISTS');

          expect(diary._records).toEqual([
            pastRecord1,
            record1,
            record2,
            record3,
          ]);
          expect(diary._closeDays).toEqual([day3]);
        });
      });

      context('when passed record with equal value', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.addRecord(newRecordWithSameValue);
          }).toThrowError('RECORD_DUPLICATE');

          expect(diary._records).toEqual([
            pastRecord1,
            record1,
            record2,
            record3,
          ]);
          expect(diary._closeDays).toEqual([day3]);
        });
      });

      context('when passed new record', () => {
        test('should change records', () => {
          diary.addRecord(newRecord);
          expect(diary._records).toEqual([
            pastRecord1,
            record1,
            record2,
            record3,
            newRecord,
          ]);
          expect(diary._closeDays).toEqual([day3]);
        });
      });

      context('when passed record with day sooner than close day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.addRecord(newPastRecord);
          }).toThrowError('DIARY_CLOSED');

          expect(diary._records).toEqual([
            pastRecord1,
            record1,
            record2,
            record3,
          ]);
          expect(diary._closeDays).toEqual([day3]);
        });
      });
    });

    describe('#deleteRecordAt', () => {
      context('when passed non-existent record', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.deleteRecordAt(newRecord.day);
          }).toThrowError('RECORD_NOT_FOUND');

          expect(diary._records).toEqual([
            pastRecord1,
            record1,
            record2,
            record3,
          ]);
          expect(diary._closeDays).toEqual([day3]);
        });
      });

      context('when passed record with equal neighbor records', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.deleteRecordAt(record2.day);
          }).toThrowError('RECORD_HAS_EQUAL_NEIGHTBORS');

          expect(diary._records).toEqual([
            pastRecord1,
            record1,
            record2,
            record3,
          ]);
          expect(diary._closeDays).toEqual([day3]);
        });
      });

      context('when passed record with day sooner than close day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.deleteRecordAt(newPastRecord.day);
          }).toThrowError('DIARY_CLOSED');

          expect(diary._records).toEqual([
            pastRecord1,
            record1,
            record2,
            record3,
          ]);
          expect(diary._closeDays).toEqual([day3]);
        });
      });

      context('when passed record without equal neighbor records', () => {
        test('should change records', () => {
          diary.deleteRecordAt(record1.day);
          expect(diary._records).toEqual([pastRecord1, record2, record3]);
          expect(diary._closeDays).toEqual([day3]);
        });
      });
    });

    describe('#updateRecordTo', () => {
      context('when passed non-existent record', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateRecordTo(newRecord.day, newRecord);
          }).toThrowError('RECORD_NOT_FOUND');

          expect(diary._records).toEqual([
            pastRecord1,
            record1,
            record2,
            record3,
          ]);
          expect(diary._closeDays).toEqual([day3]);
        });
      });

      context('when passed record with existing day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateRecordTo(record3.day, newRecordWithSameDay);
          }).toThrowError('RECORD_ALREADY_EXISTS');

          expect(diary._records).toEqual([
            pastRecord1,
            record1,
            record2,
            record3,
          ]);
          expect(diary._closeDays).toEqual([day3]);
        });
      });

      context('when passed record with equal value', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateRecordTo(record3.day, newRecordWithSameValue);
          }).toThrowError('RECORD_DUPLICATE');

          expect(diary._records).toEqual([
            pastRecord1,
            record1,
            record2,
            record3,
          ]);
          expect(diary._closeDays).toEqual([day3]);
        });
      });

      context(
        'when passed record with equal neighbor records and new record with day outside',
        () => {
          test('should throw exception and leave records unchanged', () => {
            expect(() => {
              diary.updateRecordTo(record2.day, newRecord);
            }).toThrowError('RECORD_HAS_LIMITED_SCOPE');

            expect(diary._records).toEqual([
              pastRecord1,
              record1,
              record2,
              record3,
            ]);

            expect(diary._closeDays).toEqual([day3]);
          });
        }
      );

      context(
        'when passed record with equal neighbor records and new record with day within',
        () => {
          test('should change passed record', () => {
            diary.updateRecordTo(record2.day, newRecordFromScope);
            expect(diary._records).toEqual([
              pastRecord1,
              record1,
              record3,
              newRecordFromScope,
            ]);

            expect(diary._closeDays).toEqual([day3]);
          });
        }
      );

      context('when passed records with day sooner than close day ', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateRecordTo(pastRecord1.day, newRecord);
          }).toThrowError('DIARY_CLOSED');

          expect(diary._records).toEqual([
            pastRecord1,
            record1,
            record2,
            record3,
          ]);
          expect(diary._closeDays).toEqual([day3]);
        });
      });

      context(
        'when passed record and new record without equal neighbor records',
        () => {
          test('should change passed record', () => {
            diary.updateRecordTo(record1.day, newRecord);
            expect(diary._records).toEqual([
              pastRecord1,
              record2,
              record3,
              newRecord,
            ]);

            expect(diary._closeDays).toEqual([day3]);
          });
        }
      );
    });

    describe('#addCloseAt', () => {
      context('when passed day is later than latest record day', () => {
        test('should change records', () => {
          diary.addCloseAt({ day });
          expect(diary._records).toEqual([
            pastRecord1,
            record1,
            record2,
            record3,
          ]);
          expect(diary._closeDays).toEqual([day3, day]);
        });
      });

      context('when passed day is sooner than latest record day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.addCloseAt(day1);
          }).toThrowError('DIARY_HAS_RECORDS_LATER');

          expect(diary._records).toEqual([
            pastRecord1,
            record1,
            record2,
            record3,
          ]);
          expect(diary._closeDays).toEqual([day3]);
        });
      });
    });

    describe('#deleteClose', () => {
      test('should throw exception and leave records unchanged', () => {
        expect(() => {
          diary.deleteClose();
        }).toThrowError('DIARY_NOT_CLOSED');

        expect(diary._records).toEqual([
          pastRecord1,
          record1,
          record2,
          record3,
        ]);

        expect(diary._closeDays).toEqual([day3]);
      });
    });

    describe('#updateCloseTo', () => {
      context('when passed any day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateCloseTo(day1);
          }).toThrowError('DIARY_NOT_CLOSED');

          expect(diary._records).toEqual([
            pastRecord1,
            record1,
            record2,
            record3,
          ]);
          expect(diary._closeDays).toEqual([day3]);
        });
      });
    });
  });

  context('when diary is closed', () => {
    beforeEach(() => {
      diary = Diary.restore(MockRecord, [pastRecord1], [day3]);
    });

    describe('#addRecord', () => {
      context('when diary have no record like new record', () => {
        test('should change records', () => {
          diary.addRecord(record1);
          expect(diary._records).toEqual([pastRecord1, record1]);
          expect(diary._closeDays).toEqual([day3]);
        });
      });

      context('when passed record with day sooner than close day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.addRecord(newPastRecord);
          }).toThrowError('DIARY_CLOSED');

          expect(diary._records).toEqual([pastRecord1]);
          expect(diary._closeDays).toEqual([day3]);
        });
      });
    });

    describe('#deleteRecordAt', () => {
      context('when passed non-existent record', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.deleteRecordAt(newRecord.day);
          }).toThrowError('DIARY_NOT_STARTED');

          expect(diary._records).toEqual([pastRecord1]);
          expect(diary._closeDays).toEqual([day3]);
        });
      });

      context('when passed record with day sooner than close day ', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.deleteRecordAt(newPastRecord.day);
          }).toThrowError('DIARY_NOT_STARTED');

          expect(diary._records).toEqual([pastRecord1]);
          expect(diary._closeDays).toEqual([day3]);
        });
      });
    });

    describe('#updateRecordTo', () => {
      context('when passed non-existent record', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateRecordTo(newRecord.day, newRecord);
          }).toThrowError('DIARY_NOT_STARTED');

          expect(diary._records).toEqual([pastRecord1]);
          expect(diary._closeDays).toEqual([day3]);
        });
      });

      context('when passed records with day sooner than close day ', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateRecordTo(newPastRecord.day, newRecord);
          }).toThrowError('DIARY_NOT_STARTED');

          expect(diary._records).toEqual([pastRecord1]);
          expect(diary._closeDays).toEqual([day3]);
        });
      });
    });

    describe('#addCloseAt', () => {
      context('when passed any day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.addCloseAt(day1);
          }).toThrowError('DIARY_NOT_STARTED');

          expect(diary._records).toEqual([pastRecord1]);
          expect(diary._closeDays).toEqual([day3]);
        });
      });
    });

    describe('#deleteClose', () => {
      test('should restore records', () => {
        diary.deleteClose();
        expect(diary._records).toEqual([pastRecord1]);
      });
    });

    describe('#updateCloseTo', () => {
      context('when passed day is sooner than latest record day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateCloseTo(day1);
          }).toThrowError('DIARY_HAS_RECORDS_LATER');

          expect(diary._records).toEqual([pastRecord1]);
          expect(diary._closeDays).toEqual([day3]);
        });
      });

      context('when passed day is later than latest record day', () => {
        test('should update close day', () => {
          diary.updateCloseTo(day9);
          expect(diary._records).toEqual([pastRecord1]);
          expect(diary._closeDays).toEqual([day9]);
        });
      });
    });
  });
});
