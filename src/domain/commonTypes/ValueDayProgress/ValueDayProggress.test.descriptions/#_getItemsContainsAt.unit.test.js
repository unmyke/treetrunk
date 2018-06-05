import { PostId } from '../../PostId';
import { Day } from '../../Day';
import { ValueDayProgress } from '../ValueDayProgress';
import { PieceRate } from '../../../subdomains/SellerManagement/PieceRate';
import { Post } from '../../../subdomains/SellerManagement/Post';

const value1 = new PostId();
const value2 = new PostId();

const newDay = new Day();
const day1 = new Day({ value: new Date('2017.01.14 00:00.000+08:00') });
const day2 = new Day({ value: new Date('2017.02.20 00:00.000+08:00') });
const day3 = new Day({ value: new Date('2017.03.14 00:00.000+08:00') });
const day4 = new Day({ value: new Date('2017.04.16 00:00.000+08:00') });
const day5 = new Day({ value: new Date('2017.05.18 00:00.000+08:00') });
const day6 = new Day({ value: new Date('2017.06.01 00:00.000+08:00') });
const day7 = new Day({ value: new Date('2017.07.01 00:00.000+08:00') });
const day8 = new Day({ value: new Date('2017.08.01 00:00.000+08:00') });
const day9 = new Day({ value: new Date('2017.09.01 00:00.000+08:00') });
const day10 = new Day({ value: new Date('2017.10.01 00:00.000+08:00') });

const interruptValue = new PostId();

describe('Domain :: entities :: ValueDayProgress :: #_getItemsContainsDay', () => {
  let valueDayProgress;
  beforeEach(() => {
    valueDayProgress = new ValueDayProgress({
      interruptValue,
    });
  });

  context('when valueDayProgress have no items', () => {
    context('when passed custom day', () => {
      test('should return empty array', () => {
        expect(valueDayProgress._getItemsContainsDay(day1)).toEqual([]);
      });
    });

    context('when no props passed', () => {
      test('should return empty array', () => {
        expect(valueDayProgress._getItemsContainsDay()).toEqual([]);
      });
    });
  });

  context('when valueDayProgress have items and not interrupted', () => {
    beforeEach(() => {
      valueDayProgress.setItems([
        new PieceRate({ value: value1, day: day2 }),
        new PieceRate({ value: value2, day: day4 }),
      ]);
    });
    context('when passed day before items', () => {
      test('should return empty array', () => {
        expect(valueDayProgress._getItemsContainsDay(day1)).toEqual([
          new PieceRate({ value: value1, day: day2 }),
          new PieceRate({ value: value2, day: day4 }),
        ]);
      });
    });
    context('when passed day of first item', () => {
      test('should return array with only first item', () => {
        expect(valueDayProgress._getItemsContainsDay(day2)).toEqual([
          new PieceRate({ value: value1, day: day2 }),
          new PieceRate({ value: value2, day: day4 }),
        ]);
      });
    });
    context('when passed day between first and second items', () => {
      test('should return array with only first item', () => {
        expect(valueDayProgress._getItemsContainsDay(day3)).toEqual([
          new PieceRate({ value: value1, day: day2 }),
          new PieceRate({ value: value2, day: day4 }),
        ]);
      });
    });
    context('when passed day of item after first', () => {
      test('should return array with all items between first item and passed day', () => {
        expect(valueDayProgress._getItemsContainsDay(day4)).toEqual([
          new PieceRate({ value: value1, day: day2 }),
          new PieceRate({ value: value2, day: day4 }),
        ]);
      });
    });
    context('when no props passed', () => {
      test('should return array with all items at moment', () => {
        expect(valueDayProgress._getItemsContainsDay()).toEqual([
          new PieceRate({ value: value1, day: day2 }),
          new PieceRate({ value: value2, day: day4 }),
        ]);
      });
    });
  });

  context('when valueDayProgress have interrupted', () => {
    beforeEach(() => {
      valueDayProgress.setItems([
        new PieceRate({ value: value1, day: day2 }),
        new PieceRate({ value: value2, day: day4 }),
        new PieceRate({ value: interruptValue, day: day6 }),
      ]);
    });
    context('when passed day before items', () => {
      test('should return empty array', () => {
        expect(valueDayProgress._getItemsContainsDay(day1)).toEqual([
          new PieceRate({ value: value1, day: day2 }),
          new PieceRate({ value: value2, day: day4 }),
        ]);
      });
    });
    context('when passed day of first item', () => {
      test('should return array with only first item', () => {
        expect(valueDayProgress._getItemsContainsDay(day2)).toEqual([
          new PieceRate({ value: value1, day: day2 }),
          new PieceRate({ value: value2, day: day4 }),
        ]);
      });
    });
    context('when passed day between first and second items', () => {
      test('should return array with only first item', () => {
        expect(valueDayProgress._getItemsContainsDay(day3)).toEqual([
          new PieceRate({ value: value1, day: day2 }),
          new PieceRate({ value: value2, day: day4 }),
        ]);
      });
    });
    context('when passed day of item after first', () => {
      test('should return array with all items between first item and passed day', () => {
        expect(valueDayProgress._getItemsContainsDay(day4)).toEqual([
          new PieceRate({ value: value1, day: day2 }),
          new PieceRate({ value: value2, day: day4 }),
        ]);
      });
    });
    context('when passed day between last item and interrupt', () => {
      test('should return array with all items between first item and passed day', () => {
        expect(valueDayProgress._getItemsContainsDay(day5)).toEqual([
          new PieceRate({ value: value1, day: day2 }),
          new PieceRate({ value: value2, day: day4 }),
        ]);
      });
    });
    context('when passed interrupt day', () => {
      test('should return empty array', () => {
        expect(valueDayProgress._getItemsContainsDay(day6)).toEqual([]);
      });
    });
    context('when no props passed', () => {
      test('should return empty array', () => {
        expect(valueDayProgress._getItemsContainsDay()).toEqual([]);
      });
    });
  });

  context('when valueDayProgress have interrupted and started again', () => {
    beforeEach(() => {
      valueDayProgress.setItems([
        new PieceRate({ value: value1, day: day2 }),
        new PieceRate({ value: value2, day: day4 }),
        new PieceRate({ value: interruptValue, day: day6 }),
        new PieceRate({ value: value2, day: day8 }),
      ]);
    });
    context('when passed day before items', () => {
      test('should return empty array', () => {
        expect(valueDayProgress._getItemsContainsDay(day1)).toEqual([
          new PieceRate({ value: value1, day: day2 }),
          new PieceRate({ value: value2, day: day4 }),
        ]);
      });
    });
    context('when passed day of first item', () => {
      test('should return array with only first item', () => {
        expect(valueDayProgress._getItemsContainsDay(day2)).toEqual([
          new PieceRate({ value: value1, day: day2 }),
          new PieceRate({ value: value2, day: day4 }),
        ]);
      });
    });
    context('when passed day between first and second items', () => {
      test('should return array with only first item', () => {
        expect(valueDayProgress._getItemsContainsDay(day3)).toEqual([
          new PieceRate({ value: value1, day: day2 }),
          new PieceRate({ value: value2, day: day4 }),
        ]);
      });
    });
    context('when passed day of item after first', () => {
      test('should return array with all items between first item and passed day', () => {
        expect(valueDayProgress._getItemsContainsDay(day4)).toEqual([
          new PieceRate({ value: value1, day: day2 }),
          new PieceRate({ value: value2, day: day4 }),
        ]);
      });
    });
    context('when passed day between last item and interrupt', () => {
      test('should return array with all items between first item and passed day', () => {
        expect(valueDayProgress._getItemsContainsDay(day5)).toEqual([
          new PieceRate({ value: value1, day: day2 }),
          new PieceRate({ value: value2, day: day4 }),
        ]);
      });
    });
    context('when passed interrupt day', () => {
      test('should return empty array', () => {
        expect(valueDayProgress._getItemsContainsDay(day6)).toEqual([]);
      });
    });
    context('when passed day between interrupt and second start', () => {
      test('should return empty array', () => {
        expect(valueDayProgress._getItemsContainsDay(day7)).toEqual([]);
      });
    });
    context('when passed second start day', () => {
      test('should return array with only first item of second start', () => {
        expect(valueDayProgress._getItemsContainsDay(day8)).toEqual([
          new PieceRate({ value: value2, day: day8 }),
        ]);
      });
    });
    context('when no props passed', () => {
      test('should return array with all items of second start at moment', () => {
        expect(valueDayProgress._getItemsContainsDay()).toEqual([
          new PieceRate({ value: value2, day: day8 }),
        ]);
      });
    });
  });

  context(
    'when valueDayProgress have interrupted, started again and interrupt again',
    () => {
      beforeEach(() => {
        valueDayProgress.setItems([
          new PieceRate({ value: value1, day: day2 }),
          new PieceRate({ value: value2, day: day4 }),
          new PieceRate({ value: interruptValue, day: day6 }),
          new PieceRate({ value: value2, day: day8 }),
          new PieceRate({ value: interruptValue, day: day10 }),
        ]);
      });
      context('when passed day before items', () => {
        test('should return empty array', () => {
          expect(valueDayProgress._getItemsContainsDay(day1)).toEqual([
            new PieceRate({ value: value1, day: day2 }),
            new PieceRate({ value: value2, day: day4 }),
          ]);
        });
      });
      context('when passed day of first item', () => {
        test('should return array with only first item', () => {
          expect(valueDayProgress._getItemsContainsDay(day2)).toEqual([
            new PieceRate({ value: value1, day: day2 }),
            new PieceRate({ value: value2, day: day4 }),
          ]);
        });
      });
      context('when passed day between first and second items', () => {
        test('should return array with only first item', () => {
          expect(valueDayProgress._getItemsContainsDay(day3)).toEqual([
            new PieceRate({ value: value1, day: day2 }),
            new PieceRate({ value: value2, day: day4 }),
          ]);
        });
      });
      context('when passed day of item after first', () => {
        test('should return array with all items between first item and passed day', () => {
          expect(valueDayProgress._getItemsContainsDay(day4)).toEqual([
            new PieceRate({ value: value1, day: day2 }),
            new PieceRate({ value: value2, day: day4 }),
          ]);
        });
      });
      context('when passed day between last item and interrupt', () => {
        test('should return array with all items between first item and passed day', () => {
          expect(valueDayProgress._getItemsContainsDay(day5)).toEqual([
            new PieceRate({ value: value1, day: day2 }),
            new PieceRate({ value: value2, day: day4 }),
          ]);
        });
      });
      context('when passed interrupt day', () => {
        test('should return empty array', () => {
          expect(valueDayProgress._getItemsContainsDay(day6)).toEqual([]);
        });
      });
      context('when passed day between interrupt and second start', () => {
        test('should return empty array', () => {
          expect(valueDayProgress._getItemsContainsDay(day7)).toEqual([]);
        });
      });
      context('when passed second start day', () => {
        test('should return array with only first item of second start', () => {
          expect(valueDayProgress._getItemsContainsDay(day8)).toEqual([
            new PieceRate({ value: value2, day: day8 }),
          ]);
        });
      });
      context('when passed day after second start day', () => {
        test('should return array with all items of second start between first item and passed day', () => {
          expect(valueDayProgress._getItemsContainsDay(day9)).toEqual([
            new PieceRate({ value: value2, day: day8 }),
          ]);
        });
      });
      context('when passed second interrupt day', () => {
        test('should return empty array', () => {
          expect(valueDayProgress._getItemsContainsDay(day10)).toEqual([]);
        });
      });
      context('when no props passed', () => {
        test('should return empty array', () => {
          expect(valueDayProgress._getItemsContainsDay()).toEqual([]);
        });
      });
    }
  );
});
