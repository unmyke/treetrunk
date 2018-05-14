import { startOfDay } from 'date-fns';
import { SeniorityTypeId, Day } from '../../commonTypes';
import { SeniorityType } from './SeniorityType';
import { Award } from './Award';

const name = '3 месяца';

const months = 3;

const award1value = 400;
const award2value = 200;
const award3value = 500;

const newDay = new Day();
const award1day = new Day({ value: new Date('2018.01.14 11:00') });
const award2day = new Day({ value: new Date('2018.02.20 11:00') });
const award3day = new Day({ value: new Date('2018.03.14 11:00') });

describe('Domain :: entities :: SeniorityType', () => {
  let seniorityType;
  beforeEach(() => {
    seniorityType = new SeniorityType({ name, months });
  });

  describe('#constructor', () => {
    test('should be instance of SeniorityType', () => {
      expect(seniorityType).toBeInstanceOf(SeniorityType);
      expect(seniorityType.seniorityTypeId).toBeInstanceOf(SeniorityTypeId);
      expect(seniorityType.name).toBe(name);
      expect(seniorityType.months).toBe(months);
      expect(seniorityType.awards).toHaveLength(0);
    });

    test('should have no award', () => {
      expect(seniorityType.getAwardAt()).toBeUndefined();
    });
  });

  describe('#addAward', () => {
    context('when add one award value', () => {
      test('should have awards length equal 1', () => {
        seniorityType.addAward(award1value, award1day);

        expect(seniorityType.awards).toHaveLength(1);
      });
    });

    context('when add same award twice a day', () => {
      test('should throw exeption', () => {
        seniorityType.addAward(award1value, award1day);

        try {
          seniorityType.addAward(award1value, award1day);
        } catch (e) {
          expect(e.details).toEqual(['SeniorityType already have this award']);
          expect(seniorityType.awards).toHaveLength(1);
        }
      });
    });

    context('when add same award another day after', () => {
      test('should throw exeption', () => {
        seniorityType.addAward(award1value, award1day);

        try {
          seniorityType.addAward(award1value, newDay);
        } catch (e) {
          expect(e.details).toEqual(['SeniorityType already have this award']);
          expect(seniorityType.awards).toHaveLength(1);
        }
      });
    });
  });

  describe('#getAwardAt', () => {
    beforeEach(() => {
      seniorityType.addAward(award2value, award2day);
      seniorityType.addAward(award3value, award3day);
      seniorityType.addAward(award1value, award1day);
    });

    context('when requested before any award added to seniorityType', () => {
      test('should return undefined', () => {
        expect(seniorityType.getAwardAt(award1day.subDays(1))).toBeUndefined();
      });
    });

    context('when requested past award', () => {
      test("should return award's value belongs to that dateRange", () => {
        expect(seniorityType.getAwardAt(award2day)).toBe(award2value);
      });
    });

    context(
      'when requested current award associated with seniorityType',
      () => {
        test("should return last award's value", () => {
          expect(seniorityType.getAwardAt(newDay)).toBe(award3value);
        });
      }
    );
  });

  describe('#deleteAward', () => {
    beforeEach(() => {
      seniorityType.addAward(award2value, award2day);
      seniorityType.addAward(award3value, award3day);
      seniorityType.addAward(award1value, award1day);
    });

    context('when delete existing award', () => {
      test('should decrease awards length', () => {
        expect(seniorityType.awards).toHaveLength(3);

        seniorityType.deleteAward(award3value, award3day);

        expect(seniorityType.awards).toHaveLength(2);
      });
    });

    context('when delete seniorityType twice', () => {
      test('should throw exeption', () => {
        seniorityType.deleteAward(award3value, award3day);

        try {
          seniorityType.deleteAward(award3value, award3day);
        } catch (e) {
          expect(e.details).toEqual(['SeniorityType have not such award']);
          expect(seller.appointments).toHaveLength(2);
        }
      });
    });
  });

  describe('#editAward', () => {
    beforeEach(() => {
      seniorityType.addAward(award1value, award1day);
    });

    context('when appointment has created with wrong award', () => {
      test('should change associated award', () => {
        seniorityType.editAward(award1value, award1day, award2value, award1day);

        expect(seniorityType.awards[0].day).toEqual(
          new Day({ value: startOfDay(award1day) })
        );
        expect(seniorityType.getAwardAt()).toBe(award2value);
      });
    });

    context('when award has created with wrong date', () => {
      test('should change associated date', () => {
        seniorityType.editAward(award1value, award1day, award1value, award2day);
        expect(seniorityType.awards).toHaveLength(1);
        expect(seniorityType.getAwardAt(award1day)).toEqual(undefined);
        expect(seniorityType.getAwardAt(award2day)).toBe(award1value);
      });
    });
  });
});
