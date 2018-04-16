import { DateRange } from '.';
import { startOfDay, endOfDay, subMilliseconds, addMilliseconds, addDays } from 'date-fns';

const validStartDate = new Date(2018, 0, 1, 12, 3, 4, 4);
const validEndDate1  = new Date(2018, 0, 2, 14, 5, 5, 2);
const validEndDate2  = new Date(2018, 0, 1,  0, 5, 5, 2);
const validEndDate3  = new Date(2018, 1, 1,  0, 5, 5, 2);

const expectedStartDate = startOfDay(validStartDate);
const expectedEndDate1  = startOfDay(validEndDate1);
const expectedEndDate2  = startOfDay(validEndDate2);
const expectedEndDate3  = startOfDay(validEndDate3);

describe('DateRange', () => {
  context('when get valid input arguments', () => {
    const dateRange1 = new DateRange({ start: validStartDate, end: validEndDate1 });
    const dateRange2 = new DateRange({ start: validStartDate, end: validEndDate2 });
    const dateRange3 = new DateRange({ start: validStartDate, end: validEndDate3 });

    it('should be valid', () => {
      expect(dateRange1.isValid()).toBeTruthy();
      expect(dateRange2.isValid()).toBeTruthy();
      expect(dateRange3.isValid()).toBeTruthy();
    });

    it('should returns start date without time', () => {
      expect(dateRange1.start).toEqual(expectedStartDate);
      expect(dateRange2.start).toEqual(expectedStartDate);
      expect(dateRange3.start).toEqual(expectedStartDate);
    });

    it('should returns end date without time', () => {
      expect(dateRange1.end).toEqual(expectedEndDate1);
      expect(dateRange2.end).toEqual(expectedEndDate2);
      expect(dateRange3.end).toEqual(expectedEndDate3);
    });

    it('should returns days count', () => {
      expect(dateRange1.length).toBe(2);
      expect(dateRange2.length).toBe(1);
      expect(dateRange3.length).toBe(32);
    });

    it('should returns true if date range contains date', () => {
      expect(dateRange1.contains(endOfDay(dateRange1.start))).toBeTruthy();
      expect(dateRange2.contains(endOfDay(dateRange2.end))).toBeTruthy();
    });

    it('should returns false if date range not contains date', () => {
      expect(dateRange3.contains(subMilliseconds(startOfDay(dateRange3.start), 1))).toBeFalsy();
      expect(dateRange3.contains(addMilliseconds(endOfDay(dateRange3.end), 1))).toBeFalsy();
    });

    it('should be iterator', () => {
      let expectedDate = dateRange3.start;
      for (let date of dateRange3) {
        expect(date).toEqual(expectedDate);
        expectedDate = addDays(expectedDate, 1);
      }
    });
  });

  context('when get no arguments', () => {
    const dateRange = new DateRange();

    it('shouldn\'t be valid', () => {
      expect(dateRange.isValid()).toBeFalsy();
    });
  });

  context('when start date more than end date', () => {
    const dateRange = new DateRange({ start: validEndDate1, end: validStartDate });

    it('shouldn\'t be valid', () => {
      expect(dateRange.isValid()).toBeFalsy();
    });
  });

  context('when start date argument is not a date', () => {
    const dateRange = new DateRange({ start: 'invalidStartDate', end: validEndDate1 });

    it('shouldn\'t be valid', () => {
      expect(dateRange.isValid()).toBeFalsy();
    });
  });

  context('when end date argument is not a date', () => {
    const dateRange = new DateRange({ start: validStartDate, end: 'invalidEndDate' });

    it('shouldn\'t be valid', () => {
      expect(dateRange.isValid()).toBeFalsy();
    });
  });

  context('when start date and end date arguments are not a date', () => {
    const dateRange = new DateRange({ start: 'invalidStartDate', end: 'invalidEndDate' });

    it('shouldn\'t be valid', () => {
      expect(dateRange.isValid()).toBeFalsy();
    });
  });

  context('when start date argument is invalid date', () => {
    const dateRange = new DateRange({ start: new Date('invalidStartDate'), end: validEndDate1 });

    it('shouldn\'t be valid', () => {
      expect(dateRange.isValid()).toBeFalsy();
    });
  });

  context('when end date argument is invalid date', () => {
    const dateRange = new DateRange({ start: validStartDate, end: new Date('invalidEndDate') });

    it('shouldn\'t be valid', () => {
      expect(dateRange.isValid()).toBeFalsy();
    });
  });

  context('when start date and end date arguments are invalid date', () => {
    const dateRange = new DateRange({ start: new Date('invalidStartDate'), end: new Date('invalidEndDate') });

    it('shouldn\'t be valid', () => {
      expect(dateRange.isValid()).toBeFalsy();
    });
  });
});
