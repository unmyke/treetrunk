import { BaseValueCollection } from './BaseValueCollection';
import { BaseValue } from '../BaseValue';
import { Day } from '../../commonTypes';

let coll;

describe('Domain :: lib :: BaseValueCollection', () => {
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
      test('should be at validateAddition state', () => {
        const item = { value: 1, day: new Day() };
        expect(
          coll.operate('add', {
            item,
          })
        ).toBeTruthy();
        expect(coll.state).toBe('validateAddition');

        expect(coll.process()).toBeTruthy();
        expect(coll.state).toBe('result');
        expect(coll.collection).toHaveLength(1);
        expect(coll.collection[0]).toBe(item);
      });
    });
  });
});
