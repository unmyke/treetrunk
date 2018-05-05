import { isValidDate, convertDate } from '.';

const validDate = new Date(2018, 0, 1, 12, 3, 4, 4);
const undefinedDate = undefined;
const invalidDate = new Date('Invalid Date');
const notDate = '';

const expectedValidDate = new Date(2018, 0, 1, 0, 0, 0, 0);

describe('Domain :: lib :: dateHelpers', () => {
  describe('#isValidDate', () => {
    context('when pass valid date', () => {
      test('should be true', () => {
        expect(isValidDate(validDate)).toBeTruthy();
      });
    });

    context('when pass no arguments', () => {
      test('should be false', () => {
        expect(isValidDate()).toBeFalsy();
        expect(isValidDate(undefinedDate)).toBeFalsy();
      });
    });

    context('when pass invalid date', () => {
      test('should be false', () => {
        expect(isValidDate(invalidDate)).toBeFalsy();
      });
    });

    context('when pass not date', () => {
      test('should be false', () => {
        expect(isValidDate(notDate)).toBeFalsy();
      });
    });
  });

  describe('#convertDate', () => {
    context('when pass valid date', () => {
      test('should be start of passed date', () => {
        expect(convertDate(validDate)).toEqual(expectedValidDate);
      });
    });

    context('when pass no arguments', () => {
      test('should be undefined', () => {
        expect(convertDate()).toBeUndefined();
        expect(convertDate(undefinedDate)).toBeUndefined();
      });
    });

    context('when pass invalid date', () => {
      test('should be invalid date', () => {
        expect(convertDate(invalidDate).toString()).toEqual(
          invalidDate.toString()
        );
      });
    });

    context('when pass not date', () => {
      test('should be invalid date', () => {
        expect(convertDate(notDate).toString()).toEqual(invalidDate.toString());
      });
    });
  });
});
