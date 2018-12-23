import { BaseValue } from '../../_lib';
import { Diary } from './diary';
import { Day } from '../day';

class MockRecord extends BaseValue {
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
const closeValue = 'closeValue';

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
      diary = new Diary();
      expect(diary.state).toBe(states.NEW);
    });

    describe('#add', () => {
      test('should transit to started state', () => {
        diary.add(value4, day);
        expect(diary.state).toBe(states.STARTED);
      });
    });

    describe('#deleteAt', () => {
      test('should throw exception and leave state unchanged', () => {
        expect(() => {
          diary.deleteAt(day1);
        }).toThrowError('DIARY_NOT_STARTED');
      });
    });

    describe('#updateTo', () => {
      test('should throw exception and leave state unchanged', () => {
        expect(() => {
          diary.updateTo(day1, newValue, day);
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
          diary = Diary.restore([record1], closeValue);
          expect(diary.state).toBe(states.STARTED);
        });

        describe('#add', () => {
          test('should leave state unchanged', () => {
            diary.add(value4, day);
            expect(diary.state).toBe(states.STARTED);
          });
        });

        describe('#deleteAt', () => {
          test('should transit to new state', () => {
            diary.deleteAt(day1);
            expect(diary.state).toBe(states.NEW);
          });
        });

        describe('#updateTo', () => {
          test('should leave state unchanged', () => {
            diary.updateTo(day1, newValue, day);
            expect(diary.state).toBe(states.STARTED);
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
          diary = Diary.restore([record1, record2], closeValue);
          expect(diary.state).toBe(states.STARTED);
        });

        describe('#add', () => {
          test('should leave state unchanged', () => {
            diary.add(value4, day);
            expect(diary.state).toBe(states.STARTED);
          });
        });

        describe('#deleteAt', () => {
          test('should leave state unchanged', () => {
            diary.deleteAt(day3);
            expect(diary.state).toBe(states.STARTED);
          });
        });

        describe('#updateTo', () => {
          test('should leave state unchanged', () => {
            diary.updateTo(day3, newValue, day);
            expect(diary.state).toBe(states.STARTED);
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
          diary = Diary.restore([record1, record2, closeRecord1], closeValue);
          expect(diary.state).toBe(states.STARTED);
        });

        describe('#add', () => {
          test('should leave state unchanged', () => {
            diary.add(value4, day);
            expect(diary.state).toBe(states.STARTED);
          });
        });

        describe('#deleteAt', () => {
          test('should transit to closed state', () => {
            diary.deleteAt(day3);
            expect(diary.state).toBe(states.CLOSED);
          });
        });

        describe('#updateTo', () => {
          test('should leave state unchanged', () => {
            diary.updateTo(day3, newValue, day);
            expect(diary.state).toBe(states.STARTED);
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
            [record1, record2, record3, closeRecord1],
            closeValue
          );
          expect(diary.state).toBe(states.STARTED);
        });

        describe('#add', () => {
          test('should leave state unchanged', () => {
            diary.add(value4, day);
            expect(diary.state).toBe(states.STARTED);
          });
        });

        describe('#deleteAt', () => {
          test('should leave state unchanged', () => {
            diary.deleteAt(day3);
            expect(diary.state).toBe(states.STARTED);
          });
        });

        describe('#updateTo', () => {
          test('should leave state unchanged', () => {
            diary.updateTo(day3, newValue, day);
            expect(diary.state).toBe(states.STARTED);
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
        diary = Diary.restore([record1, closeRecord1], closeValue);
        expect(diary.state).toBe(states.CLOSED);
      });

      describe('#add', () => {
        test('should transit to started state', () => {
          diary.add(value4, day);
          expect(diary.state).toBe(states.STARTED);
        });
      });

      describe('#deleteAt', () => {
        test('should throw exception and leave state unchanged', () => {
          expect(() => {
            diary.deleteAt(day1);
          }).toThrowError('DIARY_NOT_STARTED');
        });
      });

      describe('#updateTo', () => {
        test('should throw exception and leave state unchanged', () => {
          expect(() => {
            diary.updateTo(day1, newValue, day);
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
        diary = Diary.restore(
          [record1, record2, closeRecord1, closeRecord2],
          closeValue
        );
        expect(diary.state).toBe(states.CLOSED);
      });

      describe('#add', () => {
        test('should transit to started state', () => {
          diary.add(value4, day);
          expect(diary.state).toBe(states.STARTED);
        });
      });

      describe('#deleteAt', () => {
        test('should throw exception and leave state unchanged', () => {
          expect(() => {
            diary.deleteAt(day2);
          }).toThrowError('DIARY_NOT_STARTED');
        });
      });

      describe('#updateTo', () => {
        test('should throw exception and leave state unchanged', () => {
          expect(() => {
            diary.updateTo(day1, newValue, day);
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
