import Diary from './diary';
import Day from '../day';

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
const closeValue = 'closeValue';

const pastRecord1 = { value: pastValue1, day: day1 };
const record1 = { value: value1, day: day5 };
const record2 = { value: value2, day: day7 };
const record3 = { value: value1, day: day9 };
const closeRecord = { value: closeValue, day: day3 };
const newRecord = { value: newValue, day: day4 };
const newRecordFromScope = { value: newValue, day: day8 };
const newRecordWithSameDay = { value: newValue, day: day5 };
const newRecordWithSameValue = { value: value1, day: day6 };
const newPastRecord = { value: newValue, day: day2 };

let diary;

describe('Domain :: commonTypes :: Diary', () => {
  context('when diary is new', () => {
    beforeEach(() => {
      diary = Diary.restore([], closeValue);
    });

    describe('#add', () => {
      context('when passed record', () => {
        test('should change records', () => {
          diary.add(record1.value, record1.day);

          expect(diary.records).toEqual([record1]);
        });
      });
    });

    describe('#deleteAt', () => {
      context('when passed any record', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.deleteAt(newRecord.day);
          }).toThrowError('DIARY_NOT_STARTED');

          expect(diary._store.size).toBe(0);
          expect(diary._archive.size).toBe(0);
        });
      });
    });

    describe('#updateTo', () => {
      context('when passed any record', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateTo(record1.day, newRecord.value, newRecord.day);
          }).toThrowError('DIARY_NOT_STARTED');

          expect(diary._store.size).toBe(0);
          expect(diary._archive.size).toBe(0);
        });
      });
    });

    describe('#addCloseAt', () => {
      context('when passed any day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.addCloseAt(day1);
          }).toThrowError('DIARY_NOT_STARTED');

          expect(diary._store.size).toBe(0);
          expect(diary._archive.size).toBe(0);
        });
      });
    });

    describe('#deleteClose', () => {
      test('should throw exception and leave records unchanged', () => {
        expect(() => {
          diary.deleteClose();
        }).toThrowError('DIARY_NOT_CLOSED');

        expect(diary._store.size).toBe(0);
        expect(diary._archive.size).toBe(0);
      });
    });

    describe('#updateCloseTo', () => {
      context('when passed any day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateCloseTo(day1);
          }).toThrowError('DIARY_NOT_CLOSED');

          expect(diary._store.size).toBe(0);
          expect(diary._archive.size).toBe(0);
        });
      });
    });
  });

  context('when diary is started', () => {
    beforeEach(() => {
      diary = Diary.restore(
        [pastRecord1, record1, record2, record3, closeRecord],
        closeValue
      );
    });

    describe('#add', () => {
      context('when passed record with existing day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.add(newRecordWithSameDay.value, newRecordWithSameDay.day);
          }).toThrowError('RECORD_ALREADY_EXISTS');

          expect(diary._store.records).toEqual([record1, record2, record3]);
          expect(diary._archive.map(({ day }) => day)).toEqual([day3]);
          expect(diary._archive.get(day3).value.size).toBe(1);
        });
      });

      context('when passed record with equal value', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.add(newRecordWithSameValue.value, newRecordWithSameValue.day);
          }).toThrowError('RECORD_DUPLICATE');

          expect(diary._store.records).toEqual([record1, record2, record3]);
          expect(diary._archive.map(({ day }) => day)).toEqual([day3]);
        });
      });

      context('when passed new record', () => {
        test('should change records', () => {
          diary.add(newRecord.value, newRecord.day);
          expect(diary._store.records).toEqual([
            newRecord,
            record1,
            record2,
            record3,
          ]);
          expect(diary._archive.map(({ day }) => day)).toEqual([day3]);
        });
      });

      context('when passed record with day sooner than close day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.add(newPastRecord.value, newPastRecord.day);
          }).toThrowError('DIARY_CLOSED');

          expect(diary._store.records).toEqual([record1, record2, record3]);
          expect(diary._archive.map(({ day }) => day)).toEqual([day3]);
        });
      });
    });

    describe('#deleteAt', () => {
      context('when passed non-existent record', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.deleteAt(newRecord.day);
          }).toThrowError('RECORD_NOT_FOUND');

          expect(diary._store.records).toEqual([record1, record2, record3]);
          expect(diary._archive.map(({ day }) => day)).toEqual([day3]);
        });
      });

      context('when passed record with equal neighbor records', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.deleteAt(record2.day);
          }).toThrowError('RECORD_HAS_EQUAL_NEIGHBOURS');

          expect(diary._store.records).toEqual([record1, record2, record3]);
          expect(diary._archive.map(({ day }) => day)).toEqual([day3]);
        });
      });

      context('when passed record with day sooner than close day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.deleteAt(newPastRecord.day);
          }).toThrowError('DIARY_CLOSED');

          expect(diary._store.records).toEqual([record1, record2, record3]);
          expect(diary._archive.map(({ day }) => day)).toEqual([day3]);
        });
      });

      context('when passed record without equal neighbor records', () => {
        test('should change records', () => {
          diary.deleteAt(record1.day);
          expect(diary._store.records).toEqual([record2, record3]);
          expect(diary._archive.map(({ day }) => day)).toEqual([day3]);
        });
      });
    });

    describe('#updateTo', () => {
      context('when passed non-existent record', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateTo(newRecord.day, newRecord.value, newRecord.day);
          }).toThrowError('RECORD_NOT_FOUND');

          expect(diary._store.records).toEqual([record1, record2, record3]);
          expect(diary._archive.map(({ day }) => day)).toEqual([day3]);
        });
      });

      context('when passed record with existing day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateTo(
              record3.day,
              newRecordWithSameDay.value,
              newRecordWithSameDay.day
            );
          }).toThrowError('RECORD_ALREADY_EXISTS');

          expect(diary._store.records).toEqual([record1, record2, record3]);
          expect(diary._archive.map(({ day }) => day)).toEqual([day3]);
        });
      });

      context('when passed record with equal value', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateTo(
              record3.day,
              newRecordWithSameValue.value,
              newRecordWithSameValue.day
            );
          }).toThrowError('RECORD_DUPLICATE');

          expect(diary._store.records).toEqual([record1, record2, record3]);
          expect(diary._archive.map(({ day }) => day)).toEqual([day3]);
        });
      });

      context(
        'when passed record with equal neighbor records and new record with day outside',
        () => {
          test('should throw exception and leave records unchanged', () => {
            expect(() => {
              diary.updateTo(record2.day, newRecord.value, newRecord.day);
            }).toThrowError('RECORD_HAS_LIMITED_SCOPE');

            expect(diary._store.records).toEqual([record1, record2, record3]);

            expect(diary._archive.map(({ day }) => day)).toEqual([day3]);
          });
        }
      );

      context(
        'when passed record with equal neighbor records and new record with day within',
        () => {
          test('should change passed record', () => {
            diary.updateTo(
              record2.day,
              newRecordFromScope.value,
              newRecordFromScope.day
            );
            expect(diary._store.records).toEqual([
              record1,
              newRecordFromScope,
              record3,
            ]);

            expect(diary._archive.map(({ day }) => day)).toEqual([day3]);
          });
        }
      );

      context('when passed records with day sooner than close day ', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateTo(pastRecord1.day, newRecord.value, newRecord.day);
          }).toThrowError('DIARY_CLOSED');

          expect(diary._store.records).toEqual([record1, record2, record3]);
          expect(diary._archive.map(({ day }) => day)).toEqual([day3]);
        });
      });

      context(
        'when passed record and new record without equal neighbor records',
        () => {
          test('should change passed record', () => {
            diary.updateTo(record1.day, newRecord.value, newRecord.day);
            expect(diary._store.records).toEqual([newRecord, record2, record3]);

            expect(diary._archive.map(({ day }) => day)).toEqual([day3]);
          });
        }
      );
    });

    describe('#addCloseAt', () => {
      context('when passed day is later than latest record day', () => {
        test('should change records', () => {
          diary.addCloseAt(day);
          expect(diary._store.records).toHaveLength(0);
          expect(diary._archive.get(day3).value.records).toEqual([pastRecord1]);
          expect(diary._archive.get(day).value.records).toEqual([
            record1,
            record2,
            record3,
          ]);
        });
      });

      context('when passed day is latest record day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.addCloseAt(day9);
          }).toThrowError('DIARY_HAS_RECORDS_LATER');

          expect(diary._store.records).toEqual([record1, record2, record3]);
          expect(diary._archive.get(day3).value.records).toEqual([pastRecord1]);
        });
      });

      context('when passed day is sooner than latest record day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.addCloseAt(day8);
          }).toThrowError('DIARY_HAS_RECORDS_LATER');

          expect(diary._store.records).toEqual([record1, record2, record3]);
          expect(diary._archive.get(day3).value.records).toEqual([pastRecord1]);
        });
      });
    });

    describe('#deleteClose', () => {
      test('should throw exception and leave records unchanged', () => {
        expect(() => {
          diary.deleteClose();
        }).toThrowError('DIARY_NOT_CLOSED');

        expect(diary._store.records).toEqual([record1, record2, record3]);
        expect(diary._archive.get(day3).value.records).toEqual([pastRecord1]);
      });
    });

    describe('#updateCloseTo', () => {
      context('when passed any day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateCloseTo(day1);
          }).toThrowError('DIARY_NOT_CLOSED');

          expect(diary._store.records).toEqual([record1, record2, record3]);
          expect(diary._archive.get(day3).value.records).toEqual([pastRecord1]);
        });
      });
    });
  });

  context('when diary is closed', () => {
    beforeEach(() => {
      diary = Diary.restore([pastRecord1, closeRecord], closeValue);
    });

    describe('#add', () => {
      context('when diary have no record like new record', () => {
        test('should change records', () => {
          diary.add(record1.value, record1.day);
          expect(diary._store.records).toEqual([record1]);
          expect(diary._archive.get(day3).value.records).toEqual([pastRecord1]);
        });
      });

      context('when passed record with day sooner than close day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.add(newPastRecord.value, newPastRecord.day);
          }).toThrowError('DIARY_CLOSED');

          expect(diary._store.records).toHaveLength(0);
          expect(diary._archive.get(day3).value.records).toEqual([pastRecord1]);
        });
      });
    });

    describe('#deleteAt', () => {
      context('when passed non-existent record', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.deleteAt(newRecord.day);
          }).toThrowError('DIARY_NOT_STARTED');

          expect(diary._store.records).toHaveLength(0);
          expect(diary._archive.get(day3).value.records).toEqual([pastRecord1]);
        });
      });

      context('when passed record with day sooner than close day ', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.deleteAt(newPastRecord.day);
          }).toThrowError('DIARY_NOT_STARTED');

          expect(diary._store.records).toHaveLength(0);
          expect(diary._archive.get(day3).value.records).toEqual([pastRecord1]);
        });
      });
    });

    describe('#updateTo', () => {
      context('when passed non-existent record', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateTo(newRecord.day, newRecord.value, newRecord.day);
          }).toThrowError('DIARY_NOT_STARTED');

          expect(diary._store.records).toHaveLength(0);
          expect(diary._archive.get(day3).value.records).toEqual([pastRecord1]);
        });
      });

      context('when passed records with day sooner than close day ', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateTo(newPastRecord.day, newRecord.value, newRecord.day);
          }).toThrowError('DIARY_NOT_STARTED');

          expect(diary._store.records).toHaveLength(0);
          expect(diary._archive.get(day3).value.records).toEqual([pastRecord1]);
        });
      });
    });

    describe('#addCloseAt', () => {
      context('when passed any day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.addCloseAt(day1);
          }).toThrowError('DIARY_NOT_STARTED');

          expect(diary._store.records).toHaveLength(0);
          expect(diary._archive.get(day3).value.records).toEqual([pastRecord1]);
        });
      });
    });

    describe('#deleteClose', () => {
      test('should restore records', () => {
        diary.deleteClose();
        expect(diary._store.records).toEqual([pastRecord1]);
        expect(diary._archive.size).toBe(0);
      });
    });

    describe('#updateCloseTo', () => {
      context('when passed day is sooner than latest record day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateCloseTo(day1.prev());
          }).toThrowError('DIARY_HAS_RECORDS_LATER');

          expect(diary._store.records).toHaveLength(0);
          expect(diary._archive.get(day3).value.records).toEqual([pastRecord1]);
        });
      });

      context('when passed day is latest record day', () => {
        test('should throw exception and leave records unchanged', () => {
          expect(() => {
            diary.updateCloseTo(day1);
          }).toThrowError('DIARY_HAS_RECORDS_LATER');

          expect(diary._store.records).toHaveLength(0);
          expect(diary._archive.get(day3).value.records).toEqual([pastRecord1]);
        });
      });

      context('when passed day is later than latest record day', () => {
        test('should update close day', () => {
          diary.updateCloseTo(day9);
          expect(diary._store.records).toHaveLength(0);
          expect(diary._archive.get(day9).value.records).toEqual([pastRecord1]);
        });
      });
    });
  });
});
