import { ValueDayProgress } from './ValueDayProgress';
import { BaseValue } from '../../_lib';
import { Day } from '../Day';

class MockItem extends BaseValue {
  constructor({ value, day }) {
    super();
    this.value = value;
    this.day = day;
  }
}

const day0 = new Day({ value: new Date('2017.01.01') });
const day1 = new Day({ value: new Date('2017.01.20') });
const day2 = new Day({ value: new Date('2017.02.20') });
const day3 = new Day({ value: new Date('2017.03.20') });
const day4 = new Day({ value: new Date('2017.04.20') });
const day5 = new Day({ value: new Date('2017.05.20') });
const day6 = new Day({ value: new Date('2017.06.20') });
const day7 = new Day({ value: new Date('2017.07.20') });

const interruptValue = new MockItem({ value: 'interrupt' });

const item1 = new MockItem({ value: 1, day: day1 });
const item2 = new MockItem({ value: 2, day: day2 });
const item3 = new MockItem({ value: 'interrupt', day: day3 });
const item4 = new MockItem({ value: 5, day: day5 });
const item5 = new MockItem({ value: 'interrupt', day: day7 });

const interruptedItems = [item1, item2, item3];
const items = [item1, item2, item3, item4];

let coll;
let result;

describe('Domain :: lib :: ValueDayProgress', () => {
  beforeEach(() => {
    coll = new ValueDayProgress(interruptValue);
  });

  context('when items is empty', () => {
    context('when initialized', () => {
      test('should items be empty', () => {
        expect(coll.items).toHaveLength(0);
        expect(coll.hasItems).toBe(false);
      });

      test('should have item value undefined', () => {
        expect(coll.itemValue).toBeUndefined();
      });

      test('should be at idle state', () => {
        expect(coll.state).toBe('idle');
      });
    });

    describe('#add', () => {
      beforeEach(() => {
        result = coll.addItem(item1);
      });

      test('should return successful result', () => {
        expect(result).toEqual({ done: true, error: null });
      });

      test('should fill items', () => {
        expect(coll.hasItems).toBe(true);
        expect(coll.items).toEqual([item1]);
        expect(coll.items).toHaveLength(1);
      });

      test('should set added item value', () => {
        expect(coll.itemValue).toBe(item1.value);
      });

      test('should return to idle state', () => {
        expect(coll.state).toBe('idle');
      });
    });

    describe('#delete', () => {
      beforeEach(() => {
        result = coll.deleteItem(item1);
      });

      test('should return unsuccessful result', () => {
        console.log(result);
        expect(result).toEqual({
          done: false,
          error: ['Mock item with value "1" at 20.01.2017 not found'],
        });
      });

      test('should leave items unchanged', () => {
        expect(coll.hasItems).toBe(false);
        expect(coll.items).toEqual([]);
        expect(coll.items).toHaveLength(0);
      });

      test('should return to idle state', () => {
        expect(coll.state).toBe('idle');
      });
    });

    describe('#edit', () => {});

    describe('#set', () => {
      beforeEach(() => {
        result = coll.setItems(items);
      });

      test('should return successful result', () => {
        expect(result).toEqual({ done: true, error: null });
      });

      test('should fill items', () => {
        expect(coll.hasItems).toBe(true);
        expect(coll.items).toEqual(items);
        expect(coll.items).toHaveLength(4);
      });

      test('should set added item value', () => {
        expect(coll.itemValue).toBe(item4.value);
      });

      test('should return to idle state', () => {
        expect(coll.state).toBe('idle');
      });
    });
  });

  context('when items is not empty', () => {
    beforeEach(() => {
      coll.setItems(items);
    });

    context('when initialized', () => {
      test('should items be filled', () => {
        expect(coll.hasItems).toBe(true);
        expect(coll.items).toEqual([item4]);
        expect(coll.items).toHaveLength(1);
      });

      test('should have item value not undefined', () => {
        expect(coll.itemValue).toBe(item4.value);
      });

      test('should have start day', () => {
        expect(coll.startDay).toBe(day5);
      });

      test('should be at idle state', () => {
        expect(coll.state).toBe('idle');
      });
    });

    describe('#add', () => {
      context('when item already exists at passed day', () => {
        test('should return unsuccessful result', () => {
          expect(coll.addItem(item1)).toEqual({
            done: false,
            error: ['Mock item with value "1" at 20.01.2017 already exists'],
          });
        });
      });

      context('when no item exists at passed day', () => {
        context('when passed item value is the same as persisted', () => {
          test('should return unsuccessful result', () => {
            expect(coll.addItem({ value: 5, day: day6 })).toEqual({
              done: false,
              error: ['Previous object already have value "5"'],
            });
          });
        });

        context('when passed item value is not the same as persisted', () => {
          context('when passed day is sooner than first item was added', () => {
            beforeEach(() => {
              result = coll.addItem(
                new MockItem({
                  value: 4,
                  day: day4,
                })
              );
            });

            test('should return successful result', () => {
              expect(result).toEqual({ done: true, error: null });
            });

            test('should change start day', () => {
              expect(coll.getStartDayAt(day5)).toBe(day4);
            });

            test('should change items', () => {
              expect(coll.getItemsAt(day5)).toBe([
                {
                  value: 4,
                  day: day4,
                },
                item4,
              ]);
            });
          });

          context('when passed day is later than start day', () => {
            test('should return successful result', () => {
              expect(
                coll.addItem(
                  new MockItem({
                    value: 3,
                    day: day0,
                  })
                )
              ).toEqual({
                done: true,
                error: null,
              });
              expect(coll.getStartDayAt(day0)).toBe(day0);
            });
          });
        });
      });
    });

    describe('#delete', () => {
      context('when item already exists at passed day', () => {
        context('when previous and next item values are the same', () => {});

        context(
          'when previous and next item values are not the same',
          () => {}
        );
      });

      context('when no item exists at passed day', () => {
        beforeEach(() => {
          result = coll.deleteItem(
            new MockItem({
              value: 5,
              day: day4,
            })
          );
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            error: [`Mock item with value "5" at 20.04.2017 not found`],
          });
        });

        test('should leave items unchanged', () => {
          expect(coll.hasItems).toBe(true);
          expect(coll.items).toEqual([item4]);
          expect(coll.items).toHaveLength(1);
        });

        test('should return to idle state', () => {
          expect(coll.state).toBe('idle');
        });
      });
    });

    describe('#edit', () => {
      context('when item already exists at passed day', () => {});

      context('when no item exists at passed day', () => {});
    });

    describe('#set', () => {});
  });

  context('when items is interrupted', () => {
    beforeEach(() => {
      coll.setItems(interruptedItems);
    });

    context('when initialized', () => {
      test('should items be empty', () => {
        expect(coll.hasItems).toBe(false);
        expect(coll.items).toBe([]);
        expect(coll.items).toHaveLength(0);
      });

      test('should have item value undefined', () => {
        expect(coll.itemValue).toBeUndefined();
      });

      test('should have no start day', () => {
        expect(coll.startDay).toBeUndefined();
      });

      test('should be at idle state', () => {
        expect(coll.state).toBe('idle');
      });
    });

    describe('#add', () => {
      context('when passed interrupt item', () => {
        beforeEach(() => {
          result = coll.addItem(item3);
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            error: [
              `Mock item with value "${
                item3.value
              }" at 20.01.2017 already exists`,
            ],
          });
        });

        test('should leave items unchanged', () => {
          expect(coll.hasItems).toBe(false);
          expect(coll.items).toEqual([]);
          expect(coll.items).toHaveLength(0);
        });

        test('should return to idle state', () => {
          expect(coll.state).toBe('idle');
        });
      });

      context('when passed not interrupt item', () => {
        beforeEach(() => {
          result = coll.addItem(item4);
        });

        test('should return successful result', () => {
          expect(result).toEqual({ done: true, error: null });
        });

        test('should fill items', () => {
          expect(coll.hasItems).toBe(true);
          expect(coll.items).toEqual([item4]);
          expect(coll.items).toHaveLength(1);
        });

        test('should set added item value', () => {
          expect(coll.itemValue).toBe(item4.value);
        });

        test('should return to idle state', () => {
          expect(coll.state).toBe('idle');
        });
      });
    });

    describe('#delete', () => {
      context('when interrupt item exists at passed day', () => {
        beforeEach(() => {
          result = coll.deleteItem(item3);
        });

        test('should return successful result', () => {
          expect(result).toEqual({ done: true, error: null });
        });

        test('should restore items', () => {
          expect(coll.hasItems).toBe(true);
          expect(coll.items).toEqual([item1, item2]);
          expect(coll.items).toHaveLength(2);
        });

        test('should set added item value', () => {
          expect(coll.itemValue).toBe(item2.value);
        });

        test('should return to idle state', () => {
          expect(coll.state).toBe('idle');
        });
      });

      context('when no interrupt item exists at passed day', () => {
        beforeEach(() => {
          result = coll.deleteItem(
            new MockItem({
              value: interruptValue,
              day: day4,
            })
          );
        });

        test('should return unsuccessful result', () => {
          expect(result).toEqual({
            done: false,
            error: ['Mock item with value "interrupt" at 20.04.2017 not found'],
          });
        });

        test('should leave items unchanged', () => {
          expect(coll.hasItems).toBe(false);
          expect(coll.items).toEqual([]);
          expect(coll.items).toHaveLength(0);
        });

        test('should return to idle state', () => {
          expect(coll.state).toBe('idle');
        });
      });
    });

    describe('#edit', () => {
      beforeEach(() => {
        result = coll.editItem(item3, item3);
      });

      test('should return unsuccessful result', () => {
        expect(result).toEqual({
          done: false,
          error: ['Mock items for edit not exist'],
        });
      });

      test('should leave items unchanged', () => {
        expect(coll.hasItems).toBe(false);
        expect(coll.items).toEqual([]);
        expect(coll.items).toHaveLength(0);
      });

      test('should return to idle state', () => {
        expect(coll.state).toBe('idle');
      });
    });

    describe('#set', () => {});
  });
});
