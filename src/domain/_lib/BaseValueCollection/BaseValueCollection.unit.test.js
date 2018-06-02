import { BaseValueCollection } from './BaseValueCollection';
import { BaseValue } from '../BaseValue';
import { Day } from '../../commonTypes';

class MockItem extends BaseValue {
  constructor({ value, day }) {
    super();
    this.value = value;
    this.day = day;
  }
}

const day1 = new Day({ value: new Date('2017.01.20') });
const day2 = new Day({ value: new Date('2017.02.20') });
const day3 = new Day({ value: new Date('2017.03.20') });

const item1 = new MockItem({ value: 1, day: day1 });
const item2 = new MockItem({ value: 2, day: day2 });
const item3 = new MockItem({ value: 3, day: day3 });

let coll;

describe('Domain :: lib :: BaseValueCollection', () => {
  const items = [item1, item2, item3];
  beforeEach(() => {
    coll = new BaseValueCollection();
  });

  context('when collection is empty', () => {
    context('when initialized', () => {
      test('should be at idle state', () => {
        expect(coll.state).toBe('idle');
      });
    });

    context('when operation "add" is emitted', () => {
      test('should be at add item', () => {
        expect(coll.state).toBe('idle');

        expect(coll.addItem(item1)).toEqual({ done: true, error: null });

        expect(coll.state).toBe('idle');
        expect(coll.collection).toHaveLength(1);
        expect(coll.collection[0]).toBe(item1);
      });
    });

    context('when operation "delete" is emitted', () => {
      test('should return unsuccessful result', () => {
        expect(coll.state).toBe('idle');

        expect(coll.deleteItem(item1)).toEqual({
          done: false,
          error: ['Mock item with value "1" at 20.01.2017 not found'],
        });

        expect(coll.state).toBe('idle');
        expect(coll.collection).toHaveLength(0);
      });
    });

    context('when operation "set" is emitted', () => {
      test('should set new collection', () => {
        expect(coll.state).toBe('idle');

        expect(coll.setItems(items)).toEqual({ done: true, error: null });

        expect(coll.state).toBe('idle');
        expect(coll.collection).toHaveLength(3);
      });
    });
  });

  context('when collection is not empty', () => {
    context('when operation "add" is emitted', () => {
      const items = [item1, item3];
      const itemsForDeleteTests = [item1, item3];
      beforeEach(() => {
        coll.setItems(items);
        expect(coll.collection).toHaveLength(2);
      });

      context('when item already exists', () => {
        test('should throw error', () => {
          expect(coll.state).toBe('idle');

          expect(coll.addItem(item1)).toEqual({
            done: false,
            error: ['Mock item with value "1" at 20.01.2017 already exists'],
          });

          expect(coll.state).toBe('idle');
          expect(coll.collection).toHaveLength(2);
        });
      });

      context('when passed item value equals previous value', () => {
        test('should throw error', () => {
          expect(coll.state).toBe('idle');

          expect(coll.addItem({ value: 1, day: day2 })).toEqual({
            done: false,
            error: ['Previous object already have value 1'],
          });

          expect(coll.state).toBe('idle');
          expect(coll.collection).toHaveLength(2);
        });
      });

      context('when passed item value equals next value', () => {
        test('should throw error', () => {
          expect(coll.state).toBe('idle');

          expect(coll.addItem({ value: 3, day: day2 })).toEqual({
            done: false,
            error: ['Next object already have value 3'],
          });

          expect(coll.state).toBe('idle');
          expect(coll.collection).toHaveLength(2);
        });
      });

      context(
        'when passed item is not exists and value not equals prev or next value',
        () => {
          test('should add item', () => {
            expect(coll.state).toBe('idle');

            expect(coll.addItem(item2)).toEqual({ done: true, error: null });

            expect(coll.state).toBe('idle');
            expect(coll.collection).toEqual([item1, item2, item3]);
          });
        }
      );
    });
    context('when operation "delete" is emitted', () => {
      const items = [item1, item2, new MockItem({ value: 1, day: day3 })];

      beforeEach(() => {
        coll.setItems(items);
        expect(coll.collection).toHaveLength(3);
      });

      context('when item not found', () => {
        test('should throw error', () => {
          expect(coll.state).toBe('idle');

          expect(coll.deleteItem(item3)).toEqual({
            done: false,
            error: ['Mock item with value "3" at 20.03.2017 not found'],
          });

          expect(coll.state).toBe('idle');
          expect(coll.collection).toHaveLength(3);
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
          expect(coll.collection).toHaveLength(3);
        });
      });

      context('when item exists and previous and next values not equal', () => {
        test('should throw error', () => {
          expect(coll.state).toBe('idle');

          expect(coll.deleteItem(item1)).toEqual({ done: true, error: null });

          expect(coll.state).toBe('idle');
          expect(coll.collection).toHaveLength(2);
        });
      });
    });
  });
});
