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

const item1 = new MockItem({ value: 1, day: day1 });
const item2 = new MockItem({ value: 2, day: day2 });
const item3 = new MockItem({ value: 'interrupt', day: day3 });
const item4 = new MockItem({ value: 5, day: day5 });

// const items = [item1, item2, item3, item4];

const items = [item1, item2, item3];

let coll;

describe('Domain :: lib :: ValueDayProgress', () => {
  beforeEach(() => {
    coll = ValueDayProgress.create();
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
        expect(coll.addItem(item1)).toEqual({ done: true, error: null });
      });

      test('should increase items length', () => {
        expect(coll.items).toHaveLength(1);
      });

      test('should set added item value', () => {
        expect(coll.items).toEqual([item1]);
        expect(coll.itemValue).toBe(item1.value);
      });

      test('should set hasItems to true', () => {
        expect(coll.hasItems).toBe(true);
      });

      test('should return to idle state', () => {
        expect(coll.state).toBe('idle');
      });
    });

    describe('#delete', () => {
      let result;
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

      test('should return to idle state', () => {
        expect(coll.state).toBe('idle');
      });
    });

    describe('#set', () => {
      beforeEach(() => {
        expect(coll.setItems(items)).toEqual({ done: true, error: null });
      });

      test('should increase items length', () => {
        expect(coll.items).toHaveLength(3);
      });

      test('should set added item value', () => {
        expect(coll.items).toEqual(items);
        expect(coll.itemValue).toBe(item3.value);
      });

      test('should set hasItems to true', () => {
        expect(coll.hasItems).toBe(true);
      });

      test('should return to idle state', () => {
        expect(coll.state).toBe('idle');
      });
    });
  });

  context('when items is not empty', () => {
    describe('#add', () => {
      const items = [item1, item3];
      const itemsForDeleteTests = [item1, item3];
      beforeEach(() => {
        coll.setItems(items);
      });

      context('when item already exists at passed day', () => {
        test('should throw error', () => {
          expect(coll.addItem(item1)).toEqual({
            done: false,
            error: ['Mock item with value "1" at 20.01.2017 already exists'],
          });
        });
      });

      context('when no item exists at passed day', () => {
        context('when passed item value is the same as persisted', () => {
          test('should throw error', () => {
            expect(coll.addItem({ value: 1, day: day2 })).toEqual({
              done: false,
              error: ['Previous object already have value "1"'],
            });
          });
        });

        context('when passed item value is not the same as persisted', () => {
          context('when passed day is sooner than first item was added', () => {
            test('should change start item value', () => {
              expect(
                coll.addItem({
                  value: 3,
                  day: day0,
                })
              ).toEqual({
                done: true,
                error: null,
              });
              expect(coll.getStartValueAt(day0).toBe(3));
            });
          });

          context('when passed day is later than start item value', () => {});
        });
      });
    });

    describe('#delete', () => {
      const items = [item1, item2, new MockItem({ value: 1, day: day3 })];

      beforeEach(() => {
        coll.setItems(items);
        expect(coll.items).toHaveLength(3);
      });

      context('when item not found', () => {
        test('should throw error', () => {
          expect(coll.state).toBe('idle');

          expect(coll.deleteItem(item3)).toEqual({
            done: false,
            error: ['Mock item with value "3" at 20.03.2017 not found'],
          });

          expect(coll.state).toBe('idle');
          expect(coll.items).toHaveLength(3);
        });
      });

      context('when previous and next values are equal', () => {
        test('should throw error', () => {
          expect(coll.state).toBe('idle');

          expect(coll.deleteItem(item2)).toEqual({
            done: false,
            error: [
              'Previous mock item value and next mock item value are equal',
            ],
          });

          expect(coll.state).toBe('idle');
          expect(coll.items).toHaveLength(3);
        });
      });

      context('when item exists and previous and next values not equal', () => {
        test('should throw error', () => {
          expect(coll.state).toBe('idle');

          expect(coll.deleteItem(item1)).toEqual({
            done: true,
            error: null,
          });

          expect(coll.state).toBe('idle');
          expect(coll.items).toHaveLength(2);
        });
      });
    });
  });
});
