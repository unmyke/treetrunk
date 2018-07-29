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

let diary;

describe('Domain :: commonTypes :: Diary :: #FSM transitions', () => {
  context('when diary is new', () => {
    beforeEach(() => {
      diary = Diary.restore(MockRecord);
      expect(diary.state).toBe(states.NEW);
    });

    describe('#addRecord', () => {
      test('should transit to started state', () => {
        diary.addRecord(record4);
        expect(diary.state).toBe(states.STARTED);
      });
    });

    describe('#deleteRecordAt', () => {
      test('should throw exception and leave state unchanged', () => {
        expect(() => {
          diary.deleteRecordAt(record1.day);
        }).toThrowError('DIARY_NOT_STARTED');
      });
    });

    describe('#updateRecordTo', () => {
      test('should throw exception and leave state unchanged', () => {
        expect(() => {
          diary.updateRecordTo(record1.day, newRecord);
        }).toThrowError('DIARY_NOT_STARTED');
      });
    });

    describe('#addCloseAt', () => {
      test('should throw exception and leave state unchanged', () => {
        expect(() => {
          diary.addCloseAt(day4);
        }).toThrowError('DIARY_NOT_STARTED');
      });
    });

    describe('#deleteClose', () => {
      test('should throw exception and leave state unchanged', () => {
        expect(() => {
          diary.deleteClose();
        }).toThrowError('DIARY_NOT_CLOSED');
      });
    });

    describe('#updateCloseTo', () => {
      test('should throw exception and leave state unchanged', () => {
        expect(() => {
          diary.updateCloseTo(day4);
        }).toThrowError('DIARY_NOT_CLOSED');
      });
    });
  });

  context('when diary is started', () => {
    context('when diary was not сlosed', () => {
      context('when diary have one record', () => {
        beforeEach(() => {
          diary = Diary.restore(MockRecord, [record1]);
          expect(diary.state).toBe(states.STARTED);
        });

        describe('#addRecord', () => {
          test('should leave state unchanged', () => {
            diary.addRecord(record4);
            states.STARTED;
          });
        });

        describe('#deleteRecordAt', () => {
          test('should transit to new state', () => {
            diary.deleteRecordAt(record1.day);
            expect(diary.state).toBe(states.NEW);
          });
        });

        describe('#updateRecordTo', () => {
          test('should leave state unchanged', () => {
            diary.updateRecordTo(record1.day, newRecord);
            states.STARTED;
          });
        });

        describe('#addCloseAt', () => {
          test('should transit to closed state', () => {
            diary.addCloseAt(day4);
            expect(diary.state).toBe(states.CLOSED);
          });
        });

        describe('#deleteClose', () => {
          test('should throw exception and leave state unchanged', () => {
            expect(() => {
              diary.deleteClose();
            }).toThrowError('DIARY_NOT_CLOSED');
          });
        });

        describe('#updateCloseTo', () => {
          test('should throw exception and leave state unchanged', () => {
            expect(() => {
              diary.updateCloseTo(day4);
            }).toThrowError('DIARY_NOT_CLOSED');
          });
        });
      });

      context('when diary have more than one record', () => {
        beforeEach(() => {
          diary = Diary.restore(MockRecord, [record1, record2]);
          expect(diary.state).toBe(states.STARTED);
        });

        describe('#addRecord', () => {
          test('should leave state unchanged', () => {
            diary.addRecord(record4);
            states.STARTED;
          });
        });

        describe('#deleteRecordAt', () => {
          test('should leave state unchanged', () => {
            diary.deleteRecordAt(record2.day);
            states.STARTED;
          });
        });

        describe('#updateRecordTo', () => {
          test('should leave state unchanged', () => {
            diary.updateRecordTo(record2.day, newRecord);
            states.STARTED;
          });
        });

        describe('#addCloseAt', () => {
          test('should transit to closed state', () => {
            diary.addCloseAt(day4);
            expect(diary.state).toBe(states.CLOSED);
          });
        });

        describe('#deleteClose', () => {
          test('should throw exception and leave state unchanged', () => {
            expect(() => {
              diary.deleteClose();
            }).toThrowError('DIARY_NOT_CLOSED');
          });
        });

        describe('#updateCloseTo', () => {
          test('should throw exception and leave state unchanged', () => {
            expect(() => {
              diary.updateCloseTo(day4);
            }).toThrowError('DIARY_NOT_CLOSED');
          });
        });
      });
    });

    context('when diary was сlosed', () => {
      context('when diary have one record', () => {
        beforeEach(() => {
          diary = Diary.restore(MockRecord, [record1, record2], [day2]);
          expect(diary.state).toBe(states.STARTED);
        });

        describe('#addRecord', () => {
          test('should leave state unchanged', () => {
            diary.addRecord(record4);
            states.STARTED;
          });
        });

        describe('#deleteRecordAt', () => {
          test('should transit to closed state', () => {
            diary.deleteRecordAt(record2.day);
            expect(diary.state).toBe(states.CLOSED);
          });
        });

        describe('#updateRecordTo', () => {
          test('should leave state unchanged', () => {
            diary.updateRecordTo(record2.day, newRecord);
            states.STARTED;
          });
        });

        describe('#addCloseAt', () => {
          test('should transit to closed state', () => {
            diary.addCloseAt(day4);
            expect(diary.state).toBe(states.CLOSED);
          });
        });

        describe('#deleteClose', () => {
          test('should throw exception and leave state unchanged', () => {
            expect(() => {
              diary.deleteClose();
            }).toThrowError('DIARY_NOT_CLOSED');
          });
        });

        describe('#updateCloseTo', () => {
          test('should throw exception and leave state unchanged', () => {
            expect(() => {
              diary.updateCloseTo(day4);
            }).toThrowError('DIARY_NOT_CLOSED');
          });
        });
      });

      context('when diary have more than one record', () => {
        beforeEach(() => {
          diary = Diary.restore(
            MockRecord,
            [record1, record2, record3],
            [day2]
          );
          expect(diary.state).toBe(states.STARTED);
        });

        describe('#addRecord', () => {
          test('should leave state unchanged', () => {
            diary.addRecord(record4);
            states.STARTED;
          });
        });

        describe('#deleteRecordAt', () => {
          test('should leave state unchanged', () => {
            diary.deleteRecordAt(record3.day);
            states.STARTED;
          });
        });

        describe('#updateRecordTo', () => {
          test('should leave state unchanged', () => {
            diary.updateRecordTo(record3.day, newRecord);
            states.STARTED;
          });
        });

        describe('#addCloseAt', () => {
          test('should transit to closed state', () => {
            diary.addCloseAt(day5);
            expect(diary.state).toBe(states.CLOSED);
          });
        });

        describe('#deleteClose', () => {
          test('should throw exception and leave state unchanged', () => {
            expect(() => {
              diary.deleteClose();
            }).toThrowError('DIARY_NOT_CLOSED');
          });
        });

        describe('#updateCloseTo', () => {
          test('should throw exception and leave state unchanged', () => {
            expect(() => {
              diary.updateCloseTo(day4);
            }).toThrowError('DIARY_NOT_CLOSED');
          });
        });
      });
    });
  });

  context('when diary is closed', () => {
    context('when diary closed once', () => {
      beforeEach(() => {
        diary = Diary.restore(MockRecord, [record1], [day2]);
        expect(diary.state).toBe(states.CLOSED);
      });

      describe('#addRecord', () => {
        test('should transit to started state', () => {
          diary.addRecord(record4);
          expect(diary.state).toBe(states.STARTED);
        });
      });

      describe('#deleteRecordAt', () => {
        test('should throw exception and leave state unchanged', () => {
          expect(() => {
            diary.deleteRecordAt(record1.day);
          }).toThrowError('DIARY_NOT_STARTED');
        });
      });

      describe('#updateRecordTo', () => {
        test('should throw exception and leave state unchanged', () => {
          expect(() => {
            diary.updateRecordTo(record1.day, newRecord);
          }).toThrowError('DIARY_NOT_STARTED');
        });
      });

      describe('#addCloseAt', () => {
        test('should throw exception and leave state unchanged', () => {
          expect(() => {
            diary.addCloseAt(day4);
          }).toThrowError('DIARY_NOT_STARTED');
        });
      });

      describe('#deleteClose', () => {
        test('should transit to started state', () => {
          diary.deleteClose();
          expect(diary.state).toBe(states.STARTED);
        });
      });

      describe('#updateCloseTo', () => {
        test('should leave state unchanged', () => {
          diary.updateCloseTo(day4);
          states.CLOSED;
        });
      });
    });

    context('when diary closed more than once', () => {
      beforeEach(() => {
        diary = Diary.restore(MockRecord, [record1, record2], [day2, day4]);
        expect(diary.state).toBe(states.CLOSED);
      });

      describe('#addRecord', () => {
        test('should transit to started state', () => {
          diary.addRecord(record4);
          expect(diary.state).toBe(states.STARTED);
        });
      });

      describe('#deleteRecordAt', () => {
        test('should throw exception and leave state unchanged', () => {
          expect(() => {
            diary.deleteRecordAt(record2.day);
          }).toThrowError('DIARY_NOT_STARTED');
        });
      });

      describe('#updateRecordTo', () => {
        test('should throw exception and leave state unchanged', () => {
          expect(() => {
            diary.updateRecordTo(record1.day, newRecord);
          }).toThrowError('DIARY_NOT_STARTED');
        });
      });

      describe('#addCloseAt', () => {
        test('should throw exception and leave state unchanged', () => {
          expect(() => {
            diary.addCloseAt(day4);
          }).toThrowError('DIARY_NOT_STARTED');
        });
      });

      describe('#deleteClose', () => {
        test('should transit to started state', () => {
          diary.deleteClose();
          expect(diary.state).toBe(states.STARTED);
        });
      });

      describe('#updateCloseTo', () => {
        test('should leave state unchanged', () => {
          diary.updateCloseTo(day4);
          states.CLOSED;
        });
      });
    });
  });
});
