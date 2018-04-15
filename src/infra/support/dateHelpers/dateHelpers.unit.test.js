import { isValidDate, convertDate } from '.';
import { startOfDay, endOfDay, subMilliseconds, addMilliseconds } from 'date-fns';

const validDate = new Date(2018, 0, 1, 12, 3, 4, 4);
const undefinedDate = undefined;
const invalidDate = new Date('Invalid Date');
const notDate = '';

const expectedValidDate = startOfDay(validDate);
const expectedInvalidDate = new Date('Invalid Date');

describe('Domain :: lib :: dateHelpers', () => {
  describe('#isValidDate', () => {
    context('when pass valid date', () => {
      it('should be true', () => {
        expect(isValidDate(validDate)).toBeTruthy();
      });
    });

    context('when pass no arguments', () => {
      it('should be false', () => {
        expect(isValidDate()).toBeFalsy();
        expect(isValidDate(undefinedDate)).toBeFalsy();
      });
    });

    context('when pass invalid date', () => {
      it('should be false', () => {
        expect(isValidDate(invalidDate)).toBeFalsy();
      });
    });

    context('when pass not date', () => {
      it('should be false', () => {
        expect(isValidDate(notDate)).toBeFalsy();
      });
    });
  });

  describe('#convertDate', () => {
    context('when pass valid date', () => {
      it('should be start of passed date', () => {
        expect(convertDate(validDate)).toEqual(expectedValidDate);
      });
    });

    context('when pass no arguments', () => {
      it('should be undefined', () => {
        expect(convertDate()).toBeUndefined();
        expect(convertDate(undefinedDate)).toBeUndefined();
      });
    });

    context('when pass invalid date', () => {
      it('should be invalid date', () => {
        expect(convertDate(invalidDate).toString()).toEqual(invalidDate.toString());
      });
    });

    context('when pass not date', () => {
      it('should be invalid date', () => {
        expect(convertDate(notDate).toString()).toEqual(invalidDate.toString());
      });
    });
  });
});
