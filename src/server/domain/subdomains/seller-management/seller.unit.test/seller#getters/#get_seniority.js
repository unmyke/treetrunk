import { Seller, Post, PostId, Day, states } from '../imports';

const lastName = 'lastName';
const firstName = 'Firstname';
const middleName = 'Middlename';
const personalName = { firstName, middleName, lastName };
const phone = '55-66-00';

const floristPost = new Post({ name: 'Флорист' });
const seniorFloristPost = new Post({ name: 'Старший флорист' });

const day1 = new Day({ value: new Date('2017.02.01 00:00.000+08:00') });
const day2 = new Day({ value: new Date('2017.04.01 00:00.000+08:00') });
const day3 = new Day({ value: new Date('2017.06.01 00:00.000+08:00') });
const day4 = new Day({ value: new Date('2017.08.01 00:00.000+08:00') });
const day5 = new Day({ value: new Date('2017.10.01 00:00.000+08:00') });

const dismissPostId = new PostId();
PostId.dismissPostId = dismissPostId;

describe('Domain :: entities :: Seller :: #seniority', () => {
  let seller;

  afterEach(() => {
    seller = null;
  });

  context('when seller have no appointments', () => {
    beforeEach(() => {
      seller = new Seller({ lastName, firstName, middleName, phone });
    });

    test('should return undefined', () => {
      expect(seller.seniority).toBeUndefined();
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
    test('should return month count between recruit day and today', () => {
      expect(seller.seniority).toBe(-day1.differenceInMonths());
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
    test('should return undefined', () => {
      expect(seller.seniority).toBeUndefined();
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
    test('should return month count between second recruit day and today', () => {
      expect(seller.seniority).toBe(-day4.differenceInMonths());
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
      test('should return undefined', () => {
        expect(seller.seniority).toBeUndefined();
      });
    }
  );
});
