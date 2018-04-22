import { DayRange } from '.';
import { Day } from '../Day';
import { startOfDay, endOfDay, subMilliseconds, addMilliseconds, addDays, startOfMonth, endOfMonth } from 'date-fns';

const validStartDate = new Date(2018, 0, 1, 12, 3, 4, 4);
const validEndDate1  = new Date(2018, 0, 2, 14, 5, 5, 2);
const validEndDate2  = new Date(2018, 0, 1,  0, 5, 5, 2);
const validEndDate3  = new Date(2018, 1, 1,  0, 5, 5, 2);

const expectedStartDate = startOfDay(validStartDate);
const expectedEndDate1  = startOfDay(validEndDate1);
const expectedEndDate2  = startOfDay(validEndDate2);
const expectedEndDate3  = startOfDay(validEndDate3);

const validStartDay = new Day({ value: validStartDate });
const validEndDay1  = new Day({ value: validEndDate1 });
const validEndDay2  = new Day({ value: validEndDate2 });
const validEndDay3  = new Day({ value: validEndDate3 });

const expectedStartDay = new Day({ value: expectedStartDate });
const expectedEndDay1  = new Day({ value: expectedEndDate1 });
const expectedEndDay2  = new Day({ value: expectedEndDate2 });
const expectedEndDay3  = new Day({ value: expectedEndDate3 });

describe("Domain :: lib :: valueObjects :: DayRange", () => {
  describe("DayRange#createMonth", () => {
    context('when pass day', () => {
      it('return instance of DayRange, that represence month of this day', () => {
        const dayRange = DayRange.createMonth(validStartDay);

        const expectedDayRange = new DayRange({ start: validStartDay.startOfMonth(), end: validStartDay.endOfMonth() });

        expect(dayRange).toEqual(expectedDayRange);
      });
    });

    context('input day is undefined', () => {
      it('return inctance of DayRange, that represence current month', () => {
        const dayRange = DayRange.createMonth();
        const start = Day.createStartOfMonth();
        const end = Day.createEndOfMonth();
        const expectedDayRange = new DayRange({ start, end });

        expect(dayRange).toEqual(expectedDayRange);
      });
    });

    context('when get invalid input arguments', () => {

      context('input day is incorrect', () => {
        it('throw error', () => {
          const day = new Day({ value: '' });

          expect(() => DayRange.createMonth(day)).toThrow(DayRange.errorNotADay);
        });
      });
    });
  });


  describe("#constructor", () => {
    context('when get valid input arguments', () => {
      const dayRange1 = new DayRange({ start: validStartDay, end: validEndDay1 });
      const dayRange2 = new DayRange({ start: validStartDay, end: validEndDay2 });
      const dayRange3 = new DayRange({ start: validStartDay, end: validEndDay3 });

      it('should be valid', () => {
        expect(dayRange1.isValid()).toBeTruthy();
        expect(dayRange2.isValid()).toBeTruthy();
        expect(dayRange3.isValid()).toBeTruthy();
      });

      it('should returns start day without time', () => {
        expect(dayRange1.start).toEqual(expectedStartDay);
        expect(dayRange2.start).toEqual(expectedStartDay);
        expect(dayRange3.start).toEqual(expectedStartDay);
      });

      it('should returns end day without time', () => {
        expect(dayRange1.end).toEqual(expectedEndDay1);
        expect(dayRange2.end).toEqual(expectedEndDay2);
        expect(dayRange3.end).toEqual(expectedEndDay3);
      });
    });
  });

  describe("#length", () => {
    context('when end day is next day of start day', () => {
      const dayRange = new DayRange({ start: validStartDay, end: validEndDay1 });
      it('should returns 2', () => {
        expect(dayRange.length).toBe(2);
      });
    });
    
    context('when end day equals start day', () => {
      const dayRange = new DayRange({ start: validStartDay, end: validEndDay2 });
      it('should return 1', () => {
        expect(dayRange.length).toBe(1);
      });
    });
    
    context('when end day is 31 day later then start day', () => {
      const dayRange = new DayRange({ start: validStartDay, end: validEndDay3 });
      it('should returns 32', () => {
        expect(dayRange.length).toBe(32);
      });
    });

    context('when day range incorrect', () => {
      const dayRange = new DayRange({ start: validEndDay3, end: validStartDay });
      it('should throw error', () => {
        expect(() => dayRange.length).toThrow(DayRange.errorNotANumber);
      });
    });
  });

  describe("#contains", () => {
    context('when day range contains day', () => {
      it('should returns true', () => {
        const dayRange1 = new DayRange({ start: validStartDay, end: validEndDay1 });
        const dayRange2 = new DayRange({ start: validStartDay, end: validEndDay2 });

        expect(dayRange1.contains(new Day({ value: endOfDay(dayRange1.start) }))).toBeTruthy();
        expect(dayRange2.contains(new Day({ value: endOfDay(dayRange2.end) }))).toBeTruthy();
      });
    });

    context('when day range not contains day', () => {
      it('should returns false', () => {
        const dayRange = new DayRange({ start: validStartDay, end: validEndDay3 });

        expect(dayRange.contains(new Day({ value: subMilliseconds(startOfDay(dayRange.start), 1) }))).toBeFalsy();
        expect(dayRange.contains(new Day({ value: addMilliseconds(endOfDay(dayRange.end), 1) }))).toBeFalsy();
      });
    });
  });

  describe("#next", () => {
    it('should be iterator', () => {
      const dayRange = new DayRange({ start: validStartDay, end: validEndDay3 });

      let expectedDay = dayRange.start;
      for (let day of dayRange) {
        expect(day).toEqual(expectedDay);
        expectedDay = new Day({ value: addDays(expectedDay, 1) });
      }
    });
  });

  describe("#isValid", () => {
    context('when get no arguments', () => {
      const dayRange = new DayRange();

      it('return false', () => {
        expect(dayRange.isValid()).toBeFalsy();
      });
    });

    context('when start day more than end day', () => {
      const dayRange = new DayRange({ start: validEndDay1, end: validStartDay });

      it('return false', () => {
        expect(dayRange.isValid()).toBeFalsy();
      });
    });

    context('when start day argument is not a day', () => {
      const dayRange = new DayRange({ start: 'invalidStartDay', end: validEndDay1 });

      it('return false', () => {
        expect(dayRange.isValid()).toBeFalsy();
      });
    });

    context('when end day argument is not a day', () => {
      const dayRange = new DayRange({ start: validStartDay, end: 'invalidEndDate' });

      it('return false', () => {
        expect(dayRange.isValid()).toBeFalsy();
      });
    });

    context('when start day and end day arguments are not a day', () => {
      const dayRange = new DayRange({ start: 'invalidStartDay', end: 'invalidEndDate' });

      it('return false', () => {
        expect(dayRange.isValid()).toBeFalsy();
      });
    });

    context('when start day argument is invalid day', () => {
      const dayRange = new DayRange({ start: new Date('invalidStartDay'), end: validEndDay1 });

      it('return false', () => {
        expect(dayRange.isValid()).toBeFalsy();
      });
    });

    context('when end day argument is invalid day', () => {
      const dayRange = new DayRange({ start: validStartDay, end: new Date('invalidEndDate') });

      it('return false', () => {
        expect(dayRange.isValid()).toBeFalsy();
      });
    });

    context('when start day and end day arguments are invalid day', () => {
      const dayRange = new DayRange({ start: new Date('invalidStartDay'), end: new Date('invalidEndDate') });

      it('return false', () => {
        expect(dayRange.isValid()).toBeFalsy();
      });
    });
  });
});
