import { PostId } from '../../PostId';
import { Day } from '../../Day';

import { Diary } from '../Diary';
import { Appointment } from '../../../subdomains/SellerManagement/Appointment';

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

const closeValue = new PostId();
PostId.quitPostId = closeValue;

describe('Domain :: entities :: Diary :: #getStartDayAt', () => {
  let diary;

  context('when diary have no diary', () => {
    beforeEach(() => {
      diary = new Diary({ RecordClass: Appointment, closeValue });
    });
    test('should return undefined', () => {
      expect(diary.getStartDayAt()).toBeUndefined();
    });
  });

  context('when diary have diary and not closed', () => {
    beforeEach(() => {
      diary = new Diary({
        RecordClass: Appointment,
        closeValue,
        records: [
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
        ],
      });
    });
    test('should return day of first appointment', () => {
      expect(diary.getStartDayAt()).toBe(day2);
    });
  });

  context('when diary have closed', () => {
    beforeEach(() => {
      diary = new Diary({
        RecordClass: Appointment,
        closeValue,
        records: [
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
          new Appointment({ postId: closeValue, day: day6 }),
        ],
      });
    });
    test('should return undefined', () => {
      expect(diary.getStartDayAt()).toBeUndefined();
    });
  });

  context('when diary have closed and started again', () => {
    beforeEach(() => {
      diary = new Diary({
        RecordClass: Appointment,
        closeValue,
        records: [
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
          new Appointment({ postId: closeValue, day: day6 }),
          new Appointment({ postId: value2, day: day8 }),
        ],
      });
    });
    test('should return day of second start', () => {
      expect(diary.getStartDayAt()).toBe(day8);
    });
  });

  context('when diary have closed, started again and close again', () => {
    beforeEach(() => {
      diary = new Diary({
        RecordClass: Appointment,
        closeValue,
        records: [
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
          new Appointment({ postId: closeValue, day: day6 }),
          new Appointment({ postId: value2, day: day8 }),
          new Appointment({ postId: closeValue, day: day10 }),
        ],
      });
    });
    test('should return undefined', () => {
      expect(diary.getStartDayAt()).toBeUndefined();
    });
  });
});
