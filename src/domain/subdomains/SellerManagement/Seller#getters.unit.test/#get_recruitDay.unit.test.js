import { SellerId, PostId, Day } from '../../../commonTypes';
import { Seller } from '../Seller';
import { Post } from '../Post';

const lastName = 'lastName';
const firstName = 'Firstname';
const middleName = 'Middlename';
const personalName = { firstName, middleName, lastName };
const phone = '55-66-00';

const floristPost = new Post({ name: 'Флорист' });
const seniorFloristPost = new Post({ name: 'Старший флорист' });

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

const dismissPostId = new PostId();
PostId.dismissPostId = dismissPostId;

describe('Domain :: entities :: Seller :: #recruitDay', () => {
  let seller;
  beforeEach(() => {
    seller = new Seller({ lastName, firstName, middleName, phone });
  });

  afterEach(() => {
    seller = null;
  });

  context('when seller have no appointments', () => {
    test('should return undefined', () => {
      expect(seller.recruitDay).toBeUndefined();
    });
  });

  context('when seller have appointments and not dismissed', () => {
    beforeEach(() => {
      seller = Seller.restore({
        ...personalName,
        phone,
        appointments: [
          { postId: floristPost.postId, day: day2 },
          { postId: seniorFloristPost.postId, day: day4 },
        ],
      });
    });
    test('should return day of first appointment', () => {
      expect(seller.recruitDay).toBe(day2);
    });
  });

  context('when seller have dismissed', () => {
    beforeEach(() => {
      seller = Seller.restore({
        ...personalName,
        phone,
        appointments: [
          { postId: floristPost.postId, day: day2 },
          { postId: seniorFloristPost.postId, day: day4 },
          { postId: dismissPostId, day: day6 },
        ],
      });
    });
    test('should return undefined', () => {
      expect(seller.recruitDay).toBeUndefined();
    });
  });

  context('when seller have dismissed and recruited again', () => {
    beforeEach(() => {
      seller = Seller.restore({
        ...personalName,
        phone,
        appointments: [
          { postId: floristPost.postId, day: day2 },
          { postId: seniorFloristPost.postId, day: day4 },
          { postId: dismissPostId, day: day6 },
          { postId: seniorFloristPost.postId, day: day8 },
        ],
      });
    });
    test('should return day of second recruit', () => {
      expect(seller.recruitDay).toBe(day8);
    });
  });

  context(
    'when seller have dismissed, recruited again and dismiss again',
    () => {
      beforeEach(() => {
        seller = Seller.restore({
          ...personalName,
          phone,
          appointments: [
            { postId: floristPost.postId, day: day2 },
            { postId: seniorFloristPost.postId, day: day4 },
            { postId: dismissPostId, day: day6 },
            { postId: seniorFloristPost.postId, day: day8 },
            { postId: dismissPostId, day: day10 },
          ],
        });
      });
      test('should return undefined', () => {
        expect(seller.recruitDay).toBeUndefined();
      });
    }
  );
});