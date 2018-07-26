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

const states = {
  NEW: 'new',
  STARTED: 'started',
  CLOSED: 'closed',
};

const day1 = new Day({ value: new Date('2017.01.01 00:00:00.000+08:00') });
const day2 = new Day({ value: new Date('2017.02.01 00:00:00.000+08:00') });
const day3 = new Day({ value: new Date('2017.03.01 00:00:00.000+08:00') });
const day4 = new Day({ value: new Date('2017.04.01 00:00:00.000+08:00') });
const day5 = new Day({ value: new Date('2017.05.01 00:00:00.000+08:00') });
const day = new Day({ value: new Date('2017.05.01 00:00:00.000+08:00') });

const closeValue = 'closeValue';
const value1 = 'value1';
const value2 = 'value2';
const value3 = 'value3';
const value4 = 'value4';
const newValue = 'newValue';

const record1 = new MockRecord({ value: value1, day: day1 });
const record2 = new MockRecord({ value: value2, day: day3 });
const record3 = new MockRecord({ value: value3, day: day4 });
const record4 = new MockRecord({ value: value4, day: day5 });
const newRecord = new MockRecord({ value: newValue, day: day });

const closeRecord1 = new MockRecord({ value: closeValue, day: day2 });
const closeRecord2 = new MockRecord({ value: closeValue, day: day4 });

let diary;

describe('Domain :: commonTypes :: Diary :: #FSM transitions', () => {
  context('when diary is new', () => {
    beforeEach(() => {
      diary = new Diary({ RecordClass: MockRecord, closeValue, records: [] });
      expect(diary.state).toBe(states.NEW);
    });

    describe('#addRecord', () => {
      test('should transit to started state', () => {
        diary.addRecord({ record: record4 });
        expect(diary.state).toBe(states.STARTED);
      });
    });

    describe('#deleteRecord', () => {
      test('should throw exception and leave state unchanged', () => {
        expect(() => {
          diary.deleteRecord({ record: record1 });
        }).toThrowError('DIARY_NOT_STARTED');
      });
    });

    describe('#updateRecord', () => {
      test('should throw exception and leave state unchanged', () => {
        expect(() => {
          diary.updateRecord({ record: record1, newRecord: newRecord });
        }).toThrowError('DIARY_NOT_STARTED');
      });
    });

    describe('#addCloseRecord', () => {
      test('should throw exception and leave state unchanged', () => {
        expect(() => {
          diary.addCloseRecord({ day: day4 });
        }).toThrowError('DIARY_NOT_STARTED');
      });
    });

    describe('#deleteCloseRecord', () => {
      test('should throw exception and leave state unchanged', () => {
        expect(() => {
          diary.deleteCloseRecord();
        }).toThrowError('DIARY_NOT_CLOSED');
      });
    });

    describe('#updateCloseRecord', () => {
      test('should throw exception and leave state unchanged', () => {
        expect(() => {
          diary.updateCloseRecord({ day: day4 });
        }).toThrowError('DIARY_NOT_CLOSED');
      });
    });
  });

  context('when diary is started', () => {
    context('when diary was not сlosed', () => {
      context('when diary have one record', () => {
        beforeEach(() => {
          diary = new Diary({
            RecordClass: MockRecord,
            closeValue,
            records: [record1],
          });
          expect(diary.state).toBe(states.STARTED);
        });

        describe('#addRecord', () => {
          test('should leave state unchanged', () => {
            diary.addRecord({ record: record4 });
            states.STARTED;
          });
        });

        describe('#deleteRecord', () => {
          test('should transit to new state', () => {
            diary.deleteRecord({ record: record1 });
            expect(diary.state).toBe(states.NEW);
          });
        });

        describe('#updateRecord', () => {
          test('should leave state unchanged', () => {
            diary.updateRecord({ record: record1, newRecord: newRecord });
            states.STARTED;
          });
        });

        describe('#addCloseRecord', () => {
          test('should transit to closed state', () => {
            diary.addCloseRecord({ day: day4 });
            expect(diary.state).toBe(states.CLOSED);
          });
        });

        describe('#deleteCloseRecord', () => {
          test('should throw exception and leave state unchanged', () => {
            expect(() => {
              diary.deleteCloseRecord();
            }).toThrowError('DIARY_NOT_CLOSED');
          });
        });

        describe('#updateCloseRecord', () => {
          test('should throw exception and leave state unchanged', () => {
            expect(() => {
              diary.updateCloseRecord({ day: day4 });
            }).toThrowError('DIARY_NOT_CLOSED');
          });
        });
      });

      context('when diary have more than one record', () => {
        beforeEach(() => {
          diary = new Diary({
            RecordClass: MockRecord,
            closeValue,
            records: [record1, record2],
          });
          expect(diary.state).toBe(states.STARTED);
        });

        describe('#addRecord', () => {
          test('should leave state unchanged', () => {
            diary.addRecord({ record: record4 });
            states.STARTED;
          });
        });

        describe('#deleteRecord', () => {
          test('should leave state unchanged', () => {
            diary.deleteRecord({ record: record2 });
            states.STARTED;
          });
        });

        describe('#updateRecord', () => {
          test('should leave state unchanged', () => {
            diary.updateRecord({ record: record2, newRecord: newRecord });
            states.STARTED;
          });
        });

        describe('#addCloseRecord', () => {
          test('should transit to closed state', () => {
            diary.addCloseRecord({ day: day4 });
            expect(diary.state).toBe(states.CLOSED);
          });
        });

        describe('#deleteCloseRecord', () => {
          test('should throw exception and leave state unchanged', () => {
            expect(() => {
              diary.deleteCloseRecord();
            }).toThrowError('DIARY_NOT_CLOSED');
          });
        });

        describe('#updateCloseRecord', () => {
          test('should throw exception and leave state unchanged', () => {
            expect(() => {
              diary.updateCloseRecord({ day: day4 });
            }).toThrowError('DIARY_NOT_CLOSED');
          });
        });
      });
    });

    context('when diary was сlosed', () => {
      context('when diary have one record', () => {
        beforeEach(() => {
          diary = new Diary({
            RecordClass: MockRecord,
            closeValue,
            records: [record1, closeRecord1, record2],
          });
          expect(diary.state).toBe(states.STARTED);
        });

        describe('#addRecord', () => {
          test('should leave state unchanged', () => {
            diary.addRecord({ record: record4 });
            states.STARTED;
          });
        });

        describe('#deleteRecord', () => {
          test('should transit to closed state', () => {
            diary.deleteRecord({ record: record2 });
            expect(diary.state).toBe(states.CLOSED);
          });
        });

        describe('#updateRecord', () => {
          test('should leave state unchanged', () => {
            diary.updateRecord({ record: record2, newRecord: newRecord });
            states.STARTED;
          });
        });

        describe('#addCloseRecord', () => {
          test('should transit to closed state', () => {
            diary.addCloseRecord({ day: day4 });
            expect(diary.state).toBe(states.CLOSED);
          });
        });

        describe('#deleteCloseRecord', () => {
          test('should throw exception and leave state unchanged', () => {
            expect(() => {
              diary.deleteCloseRecord();
            }).toThrowError('DIARY_NOT_CLOSED');
          });
        });

        describe('#updateCloseRecord', () => {
          test('should throw exception and leave state unchanged', () => {
            expect(() => {
              diary.updateCloseRecord({ day: day4 });
            }).toThrowError('DIARY_NOT_CLOSED');
          });
        });
      });

      context('when diary have more than one record', () => {
        beforeEach(() => {
          diary = new Diary({
            RecordClass: MockRecord,
            closeValue,
            records: [record1, closeRecord1, record2, record3],
          });
          expect(diary.state).toBe(states.STARTED);
        });

        describe('#addRecord', () => {
          test('should leave state unchanged', () => {
            diary.addRecord({ record: record4 });
            states.STARTED;
          });
        });

        describe('#deleteRecord', () => {
          test('should leave state unchanged', () => {
            diary.deleteRecord({ record: record3 });
            states.STARTED;
          });
        });

        describe('#updateRecord', () => {
          test('should leave state unchanged', () => {
            diary.updateRecord({ record: record3, newRecord: newRecord });
            states.STARTED;
          });
        });

        describe('#addCloseRecord', () => {
          test('should transit to closed state', () => {
            diary.addCloseRecord({ day: day5 });
            expect(diary.state).toBe(states.CLOSED);
          });
        });

        describe('#deleteCloseRecord', () => {
          test('should throw exception and leave state unchanged', () => {
            expect(() => {
              diary.deleteCloseRecord();
            }).toThrowError('DIARY_NOT_CLOSED');
          });
        });

        describe('#updateCloseRecord', () => {
          test('should throw exception and leave state unchanged', () => {
            expect(() => {
              diary.updateCloseRecord({ day: day4 });
            }).toThrowError('DIARY_NOT_CLOSED');
          });
        });
      });
    });
  });

  context('when diary is closed', () => {
    context('when diary closed once', () => {
      beforeEach(() => {
        diary = new Diary({
          RecordClass: MockRecord,
          closeValue,
          records: [record1, closeRecord1],
        });
        expect(diary.state).toBe(states.CLOSED);
      });

      describe('#addRecord', () => {
        test('should transit to started state', () => {
          diary.addRecord({ record: record4 });
          expect(diary.state).toBe(states.STARTED);
        });
      });

      describe('#deleteRecord', () => {
        test('should throw exception and leave state unchanged', () => {
          expect(() => {
            diary.deleteRecord({ record: record1 });
          }).toThrowError('DIARY_NOT_STARTED');
        });
      });

      describe('#updateRecord', () => {
        test('should throw exception and leave state unchanged', () => {
          expect(() => {
            diary.updateRecord({ record: record1, newRecord: newRecord });
          }).toThrowError('DIARY_NOT_STARTED');
        });
      });

      describe('#addCloseRecord', () => {
        test('should throw exception and leave state unchanged', () => {
          expect(() => {
            diary.addCloseRecord({ day: day4 });
          }).toThrowError('DIARY_NOT_STARTED');
        });
      });

      describe('#deleteCloseRecord', () => {
        test('should transit to started state', () => {
          diary.deleteCloseRecord();
          expect(diary.state).toBe(states.STARTED);
        });
      });

      describe('#updateCloseRecord', () => {
        test('should leave state unchanged', () => {
          diary.updateCloseRecord({ day: day4 });
          states.CLOSED;
        });
      });
    });

    context('when diary closed more than once', () => {
      beforeEach(() => {
        diary = new Diary({
          RecordClass: MockRecord,
          closeValue,
          records: [record1, closeRecord1, record2, closeRecord2],
        });
        expect(diary.state).toBe(states.CLOSED);
      });

      describe('#addRecord', () => {
        test('should transit to started state', () => {
          diary.addRecord({ record: record4 });
          expect(diary.state).toBe(states.STARTED);
        });
      });

      describe('#deleteRecord', () => {
        test('should throw exception and leave state unchanged', () => {
          expect(() => {
            diary.deleteRecord({ record: record2 });
          }).toThrowError('DIARY_NOT_STARTED');
        });
      });

      describe('#updateRecord', () => {
        test('should throw exception and leave state unchanged', () => {
          expect(() => {
            diary.updateRecord({ record: record1, newRecord: newRecord });
          }).toThrowError('DIARY_NOT_STARTED');
        });
      });

      describe('#addCloseRecord', () => {
        test('should throw exception and leave state unchanged', () => {
          expect(() => {
            diary.addCloseRecord({ day: day4 });
          }).toThrowError('DIARY_NOT_STARTED');
        });
      });

      describe('#deleteCloseRecord', () => {
        test('should transit to started state', () => {
          diary.deleteCloseRecord();
          expect(diary.state).toBe(states.STARTED);
        });
      });

      describe('#updateCloseRecord', () => {
        test('should leave state unchanged', () => {
          diary.updateCloseRecord({ day: day4 });
          states.CLOSED;
        });
      });
    });
  });
});
