import { PostId, Day } from '../../../commonTypes';
import { Seller } from '../Seller';
import { Post } from '../Post';

const states = {
  NEW: 'new',
  RECRUITED: 'recruited',
  DISMISSED: 'dismissed',
  DELETED: 'deleted',
};

const lastName = 'lastName';
const firstName = 'Firstname';
const middleName = 'Middlename';
const personalName = { firstName, middleName, lastName };
const phone = '55-66-00';

const floristPost = new Post({ name: 'Флорист' });
const seniorFloristPost = new Post({ name: 'Старший флорист' });

const day1 = new Day({ value: new Date('2017.02.20 00:00.000+08:00') });
const day2 = new Day({ value: new Date('2017.04.16 00:00.000+08:00') });
const day3 = new Day({ value: new Date('2017.06.01 00:00.000+08:00') });
const day4 = new Day({ value: new Date('2017.08.01 00:00.000+08:00') });
const day5 = new Day({ value: new Date('2017.10.01 00:00.000+08:00') });

const dismissPostId = new PostId();
PostId.dismissPostId = dismissPostId;

describe('Domain :: entities :: Seller :: #appointments', () => {
  let seller;

  afterEach(() => {
    seller = null;
  });

  context('when seller have no appointments', () => {
    beforeEach(() => {
      seller = new Seller({
        ...personalName,
        phone,
      });
    });
    test('should return empty array', () => {
      expect(seller.appointments).toEqual([]);
    });
  });

  context('when seller have appointments and not dismissed', () => {
    beforeEach(() => {
      seller = Seller.restore({
        ...personalName,
        phone,
        state: states.RECRUITED,
        appointments: [
          { postId: floristPost.postId, day: day1 },
          { postId: seniorFloristPost.postId, day: day2 },
        ],
      });
    });
    test('should return array with all appointments at moment', () => {
      expect(seller.appointments).toEqual([
        { postId: floristPost.postId, day: day1 },
        { postId: seniorFloristPost.postId, day: day2 },
      ]);
    });
  });

  context('when seller have dismissed', () => {
    beforeEach(() => {
      seller = Seller.restore({
        ...personalName,
        phone,
        state: states.DISMISSED,
        appointments: [
          { postId: floristPost.postId, day: day1 },
          { postId: seniorFloristPost.postId, day: day2 },
          { postId: dismissPostId, day: day3 },
        ],
      });
    });
    test('should return empty array', () => {
      expect(seller.appointments).toEqual([]);
    });
  });

  context('when seller have dismissed and recruited again', () => {
    beforeEach(() => {
      seller = Seller.restore({
        ...personalName,
        phone,
        state: states.RECRUITED,
        appointments: [
          { postId: floristPost.postId, day: day1 },
          { postId: seniorFloristPost.postId, day: day2 },
          { postId: dismissPostId, day: day3 },
          { postId: seniorFloristPost.postId, day: day4 },
        ],
      });
    });
    test('should return array with all appointments of second recruit at moment', () => {
      expect(seller.appointments).toEqual([
        { postId: seniorFloristPost.postId, day: day4 },
      ]);
    });
  });

  context(
    'when seller have dismissed, recruited again and dismiss again',
    () => {
      beforeEach(() => {
        seller = Seller.restore({
          ...personalName,
          phone,
          state: states.DISMISSED,
          appointments: [
            { postId: floristPost.postId, day: day1 },
            { postId: seniorFloristPost.postId, day: day2 },
            { postId: dismissPostId, day: day3 },
            { postId: seniorFloristPost.postId, day: day4 },
            { postId: dismissPostId, day: day5 },
          ],
        });
      });
      test('should return empty array', () => {
        expect(seller.appointments).toEqual([]);
      });
    }
  );
});
