import { startOfDay } from 'date-fns';
import { SeniorityTypeId, Day } from '../../common-types';
import { SeniorityType } from './seniority-type';
import { SeniorityType as states } from '../../states';

const name = '3 месяца';
const months = 3;
const params = { name, months, state: states.ACTIVE };

const award1value = 400;
const award2value = 200;
const award3value = 500;

const newDay = new Day();
const award1day = new Day({ value: new Date('2018.01.14 11:00') });
const award2day = new Day({ value: new Date('2018.02.20 11:00') });
const award3day = new Day({ value: new Date('2018.03.14 11:00') });

describe('Domain :: entities :: SeniorityType', () => {
  let seniorityType;

  describe('#constructor', () => {
    beforeEach(() => {
      seniorityType = new SeniorityType(params);
    });

    test('should be instance of SeniorityType', () => {
      expect(seniorityType).toBeInstanceOf(SeniorityType);
      expect(seniorityType.seniorityTypeId).toBeInstanceOf(SeniorityTypeId);
      expect(seniorityType.name).toBe(name);
      expect(seniorityType.months).toBe(months);
      expect(seniorityType.state).toBe(states.ACTIVE);
      expect(seniorityType.awards).toHaveLength(0);
    });
  });

  describe('#addAward', () => {
    beforeEach(() => {
      seniorityType = new SeniorityType(params);
    });

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
          seniorityType.addAward(award2value, award1day);
        } catch ({ message }) {
          expect(message).toBe('AWARD_ALREADY_EXISTS');
        }

        expect(seniorityType.awards).toHaveLength(1);
        expect(seniorityType.awards[0].value).toBe(award1value);
      });
    });

    context('when add same award another day after', () => {
      test('should throw exeption', () => {
        seniorityType.addAward(award1value, award1day);

        try {
          seniorityType.addAward(award1value, newDay);
        } catch ({ message }) {
          expect(message).toEqual('AWARD_DUPLICATE');
        }
        expect(seniorityType.awards).toHaveLength(1);
      });
    });
  });

  describe('#deleteAwardAt', () => {
    beforeEach(() => {
      seniorityType = SeniorityType.restore({
        ...params,
        awards: [
          { value: award2value, day: award2day },
          { value: award3value, day: award3day },
          { value: award1value, day: award1day },
        ],
      });
    });

    context('when delete existing award', () => {
      test('should decrease awards length', () => {
        expect(seniorityType.awards).toHaveLength(3);

        seniorityType.deleteAwardAt(award3day);

        expect(seniorityType.awards).toHaveLength(2);
      });
    });

    context('when delete seniorityType twice', () => {
      test('should throw exeption', () => {
        seniorityType.deleteAwardAt(award3day);

        try {
          seniorityType.deleteAwardAt(award3day);
        } catch ({ message }) {
          expect(message).toEqual('AWARD_NOT_FOUND');
          expect(seniorityType.awards).toHaveLength(2);
        }
      });
    });
  });

  describe('#updateAwardTo', () => {
    beforeEach(() => {
      seniorityType = SeniorityType.restore({
        ...params,
        awards: [{ value: award1value, day: award1day }],
      });
    });

    context('when appointment has created with wrong award', () => {
      test('should change associated award', () => {
        seniorityType.updateAwardTo(award1day, award2value, award1day);

        expect(seniorityType.awards[0].day).toEqual(
          new Day({ value: startOfDay(award1day) })
        );
      });
    });

    context('when award has created with wrong date', () => {
      test('should change associated date', () => {
        seniorityType.updateAwardTo(award1day, award1value, award2day);
        expect(seniorityType.awards).toHaveLength(1);
      });
    });
  });
});
