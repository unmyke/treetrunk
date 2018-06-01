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

        expect(coll.state).toBe('idle');

        coll.addItem(item);

        expect(coll.state).toBe('idle');
        expect(coll.collection).toHaveLength(1);
        expect(coll.collection[0]).toBe(item);
      });
    });

    context('when operation "delete" is emitted', () => {
      test('should be at validateAddition state', () => {
        const item = {
          value: 1,
          day: new Day({ value: new Date('2018.02.20') }),
        };

        expect(coll.state).toBe('idle');

        try {
          coll.deleteItem(item);
        } catch (e) {
          expect(e.message).toBe('Not allowed');
          expect(e.details).toEqual({
            baseValueCollection: [
              'Object with value "1" at 20.02.2018 not found',
            ],
          });
        }

        expect(coll.state).toBe('error');
        expect(coll.collection).toHaveLength(0);
      });
    });
  });
});
