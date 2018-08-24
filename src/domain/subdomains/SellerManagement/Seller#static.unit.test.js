import { PostId, Day } from '../../commonTypes';
import { Seller } from './Seller';
import { Post } from './Post';
// import { errors } from '../../errors';

const states = {
  NEW: 'new',
  RECRUITED: 'recruited',
  DISMISSED: 'dismissed',
  DELETED: 'deleted',
};

const lastName = 'lastName';
const firstName = 'Firstname';
const middleName = 'Middlename';
const personalName = { lastName, firstName, middleName, phone };
const phone = '55-66-00';

const day1 = new Day({ value: new Date('2017.01.14 11:00') });
const day2 = new Day({ value: new Date('2017.02.20 11:00') });
const day3 = new Day({ value: new Date('2017.03.14 11:00') });
const day4 = new Day({ value: new Date('2017.04.16 11:00') });
const day5 = new Day({ value: new Date('2017.05.18 11:00') });
const day6 = new Day({ value: new Date('2017.06.01 11:00') });

const { postId: postId1 } = new Post({ name: 'Младший флорист' });
const { postId: postId2 } = new Post({ name: 'Флорист' });
const { postId: postId3 } = new Post({ name: 'Старший флорист' });
const { postId: postId4 } = new Post({ name: 'Главный флорист' });
const { postId: dismissPostId } = new Post({ name: 'уволен(а)' });

PostId.dismissPostId = dismissPostId;

let seller;
let sellerInstanceAt;
let appointments;

describe('Domain :: commonTypes :: Seller :: #static', () => {
  afterEach(() => {
    seller = undefined;
  });

  describe('#restore', () => {
    describe('positive', () => {
      context('#1', () => {
        beforeEach(() => {
          appointments = [];
          seller = Seller.restore({
            ...personalName,
            phone,
            state: states.NEW,
            appointments,
          });
        });

        test('should return new seller', () => {
          expect(seller.state).toBe(states.NEW);
          expect(seller.appointments).toHaveLength(0);
          expect(seller.postId).toBeUndefined();
          expect(seller.dismissDay).toBeUndefined();
        });
      });

      context('#2', () => {
        beforeEach(() => {
          appointments = [{ postId: postId1, day: day1 }];
          seller = Seller.restore({
            ...personalName,
            phone,
            state: states.RECRUITED,
            appointments,
          });
        });

        test('should return started seller', () => {
          expect(seller.state).toBe(states.RECRUITED);
          expect(seller.appointments).toEqual([{ postId: postId1, day: day1 }]);
          expect(seller.postId).toEqual(postId1);
          expect(seller.dismissDay).toBeUndefined();
        });
      });

      context('#3', () => {
        beforeEach(() => {
          appointments = [
            { postId: postId1, day: day1 },
            { postId: dismissPostId, day: day2 },
          ];
          seller = Seller.restore({
            ...personalName,
            phone,
            state: states.DISMISSED,
            appointments,
          });
        });

        test('should return closed seller', () => {
          expect(seller.state).toBe(states.DISMISSED);
          expect(seller.appointments).toHaveLength(0);
          expect(seller.postId).toBeUndefined();
          expect(seller.dismissDay).toEqual(day2);
        });
      });

      context('#4', () => {
        beforeEach(() => {
          appointments = [
            { postId: postId1, day: day1 },
            { postId: postId2, day: day2 },
            { postId: dismissPostId, day: day3 },
          ];
          seller = Seller.restore({
            ...personalName,
            phone,
            state: states.DISMISSED,
            appointments,
          });
        });

        test('should return closed seller', () => {
          expect(seller.state).toBe(states.DISMISSED);
          expect(seller.appointments).toHaveLength(0);
          expect(seller.postId).toBeUndefined();
          expect(seller.dismissDay).toEqual(day3);
        });
      });

      context('#5', () => {
        beforeEach(() => {
          appointments = [
            { postId: postId1, day: day1 },
            { postId: postId2, day: day3 },
            { postId: dismissPostId, day: day2 },
          ];
          seller = Seller.restore({
            ...personalName,
            phone,
            state: states.RECRUITED,
            appointments,
          });
        });

        test('should return started seller', () => {
          expect(seller.state).toBe(states.RECRUITED);
          expect(seller.appointments).toEqual([{ postId: postId2, day: day3 }]);
          expect(seller.postId).toEqual(postId2);
          expect(seller.dismissDay).toBeUndefined();
        });
      });

      context('#6', () => {
        beforeEach(() => {
          appointments = [
            { postId: postId1, day: day1 },
            { postId: postId2, day: day3 },
            { postId: postId3, day: day4 },
            { postId: dismissPostId, day: day2 },
          ];
          seller = Seller.restore({
            ...personalName,
            phone,
            state: states.RECRUITED,
            appointments,
          });
        });

        test('should return started seller', () => {
          expect(seller.state).toBe(states.RECRUITED);
          expect(seller.appointments).toEqual([
            { postId: postId2, day: day3 },
            { postId: postId3, day: day4 },
          ]);
          expect(seller.postId).toEqual(postId3);
          expect(seller.dismissDay).toBeUndefined();
        });
      });

      context('#7', () => {
        beforeEach(() => {
          appointments = [
            { postId: postId1, day: day1 },
            { postId: postId2, day: day3 },
            { postId: postId3, day: day4 },
            { postId: dismissPostId, day: day2 },
            { postId: dismissPostId, day: day5 },
          ];
          seller = Seller.restore({
            ...personalName,
            phone,
            state: states.DISMISSED,
            appointments,
          });
        });

        test('should return started seller', () => {
          expect(seller.state).toBe(states.DISMISSED);
          expect(seller.appointments).toHaveLength(0);
          expect(seller.postId).toBeUndefined();
          expect(seller.dismissDay).toEqual(day5);
        });
      });

      context('#8', () => {
        beforeEach(() => {
          appointments = [
            { postId: postId1, day: day1 },
            { postId: postId2, day: day3 },
            { postId: postId3, day: day5 },
            { postId: dismissPostId, day: day2 },
            { postId: dismissPostId, day: day4 },
          ];
          seller = Seller.restore({
            ...personalName,
            phone,
            state: states.RECRUITED,
            appointments,
          });
        });

        test('should return started seller', () => {
          expect(seller.state).toBe(states.RECRUITED);
          expect(seller.appointments).toEqual([{ postId: postId3, day: day5 }]);
          expect(seller.postId).toEqual(postId3);
          expect(seller.dismissDay).toBeUndefined();
        });
      });
    });

    // describe('negative', () => {
    //   context('#1', () => {
    //     beforeEach(() => {
    //       appointments = [, { postId: dismissPostId, day: day1 }];
    //     });

    //     test('should throw exeption', () => {
    //       expect(() => {
    //         seller = Seller.restore({ ...personalName, phone, appointments });
    //       }).toThrowError(errors.inconsistentState());
    //     });
    //   });

    //   context('#2', () => {
    //     beforeEach(() => {
    //       appointments = [
    //         { postId: postId1, day: day2 },
    //         { postId: postId2, day: day3 },
    //         { postId: dismissPostId, day: day1 },
    //       ];
    //     });

    //     test('should throw exeption', () => {
    //       expect(() => {
    //         seller = Seller.restore({ ...personalName, phone, appointments });
    //       }).toThrowError(errors.inconsistentState());
    //     });
    //   });

    //   context('#3', () => {
    //     beforeEach(() => {
    //       appointments = [
    //         { postId: postId1, day: day1 },
    //         { postId: dismissPostId, day: day2 },
    //         { postId: dismissPostId, day: day3 },
    //       ];
    //     });

    //     test('should throw exeption', () => {
    //       expect(() => {
    //         seller = Seller.restore({ ...personalName, phone, appointments });
    //       }).toThrowError(errors.inconsistentState());
    //     });
    //   });
    //   context('#4', () => {
    //     beforeEach(() => {
    //       appointments = [
    //         { postId: postId1, day: day1 },
    //         { postId: postId2, day: day4 },
    //         { postId: dismissPostId, day: day2 },
    //         { postId: dismissPostId, day: day3 },
    //       ];
    //     });

    //     test('should throw exeption', () => {
    //       expect(() => {
    //         seller = Seller.restore({ ...personalName, phone, appointments });
    //       }).toThrowError(errors.inconsistentState());
    //     });
    //   });

    //   context('#5', () => {
    //     beforeEach(() => {
    //       appointments = [
    //         { postId: postId1, day: day1 },
    //         { postId: postId2, day: day3 },
    //         { postId: postId2, day: day4 },
    //         { postId: dismissPostId, day: day2 },
    //       ];
    //     });

    //     test('should throw exeption', () => {
    //       expect(() => {
    //         seller = Seller.restore({ ...personalName, phone, appointments });
    //       }).toThrowError(errors.inconsistentState());
    //     });
    //   });

    //   context('#6', () => {
    //     beforeEach(() => {
    //       appointments = [
    //         { postId: postId1, day: day1 },
    //         { postId: postId2, day: day3 },
    //         { postId: postId2, day: day4 },
    //         { postId: dismissPostId, day: day2 },
    //         { postId: dismissPostId, day: day5 },
    //       ];
    //     });

    //     test('should throw exeption', () => {
    //       expect(() => {
    //         seller = Seller.restore({ ...personalName, phone, appointments });
    //       }).toThrowError(errors.inconsistentState());
    //     });
    //   });

    //   context('#7', () => {
    //     beforeEach(() => {
    //       appointments = [
    //         { postId: postId1, day: day1 },
    //         { postId: postId2, day: day2 },
    //         { postId: dismissPostId, day: day2 },
    //       ];
    //     });

    //     test('should throw exeption', () => {
    //       expect(() => {
    //         seller = Seller.restore({ ...personalName, phone, appointments });
    //       }).toThrowError(errors.inconsistentState());
    //     });
    //   });

    //   context('#8', () => {
    //     beforeEach(() => {
    //       appointments = [
    //         { postId: postId1, day: day1 },
    //         { postId: postId2, day: day1 },
    //         { postId: dismissPostId, day: day2 },
    //       ];
    //     });

    //     test('should throw exeption', () => {
    //       expect(() => {
    //         seller = Seller.restore({ ...personalName, phone, appointments });
    //       }).toThrowError(errors.inconsistentState());
    //     });
    //   });
    // });
  });

  describe('#instanceAt', () => {
    beforeEach(() => {
      seller = Seller.restore({
        ...personalName,
        state: states.RECRUITED,
        phone,
        appointments: [
          { postId: postId1, day: day1 },
          { postId: postId2, day: day3 },
          { postId: postId3, day: day4 },
          { postId: postId4, day: day6 },
          { postId: dismissPostId, day: day2 },
          { postId: dismissPostId, day: day5 },
        ],
      });
    });

    afterEach(() => {
      sellerInstanceAt = undefined;
    });

    test('#1', () => {
      sellerInstanceAt = Seller.instanceAt(seller, day1.prev());

      expect(sellerInstanceAt.state).toBe(states.NEW);
      expect(sellerInstanceAt.appointments).toHaveLength(0);
      expect(sellerInstanceAt.postId).toBeUndefined();
      expect(sellerInstanceAt.dismissDay).toBeUndefined();
    });

    test('#2', () => {
      sellerInstanceAt = Seller.instanceAt(seller, day1);

      expect(sellerInstanceAt.state).toBe(states.RECRUITED);
      expect(sellerInstanceAt.appointments).toEqual([
        { postId: postId1, day: day1 },
      ]);
      expect(sellerInstanceAt.postId).toEqual(postId1);
      expect(sellerInstanceAt.dismissDay).toBeUndefined();
    });

    test('#3', () => {
      sellerInstanceAt = Seller.instanceAt(seller, day2.prev());

      expect(sellerInstanceAt.state).toBe(states.RECRUITED);
      expect(sellerInstanceAt.appointments).toEqual([
        { postId: postId1, day: day1 },
      ]);
      expect(sellerInstanceAt.postId).toEqual(postId1);
      expect(sellerInstanceAt.dismissDay).toBeUndefined();
    });

    test('#4', () => {
      sellerInstanceAt = Seller.instanceAt(seller, day2);

      expect(sellerInstanceAt.state).toBe(states.DISMISSED);
      expect(sellerInstanceAt.appointments).toHaveLength(0);
      expect(sellerInstanceAt.postId).toBeUndefined();
      expect(sellerInstanceAt.dismissDay).toEqual(day2);
    });

    test('#4', () => {
      sellerInstanceAt = Seller.instanceAt(seller, day3.prev());

      expect(sellerInstanceAt.state).toBe(states.DISMISSED);
      expect(sellerInstanceAt.appointments).toHaveLength(0);
      expect(sellerInstanceAt.postId).toBeUndefined();
      expect(sellerInstanceAt.dismissDay).toEqual(day2);
    });

    test('#5', () => {
      sellerInstanceAt = Seller.instanceAt(seller, day3);

      expect(sellerInstanceAt.state).toBe(states.RECRUITED);
      expect(sellerInstanceAt.appointments).toEqual([
        { postId: postId2, day: day3 },
      ]);
      expect(sellerInstanceAt.postId).toEqual(postId2);
      expect(sellerInstanceAt.dismissDay).toBeUndefined();
    });

    test('#6', () => {
      sellerInstanceAt = Seller.instanceAt(seller, day4.prev());

      expect(sellerInstanceAt.state).toBe(states.RECRUITED);
      expect(sellerInstanceAt.appointments).toEqual([
        { postId: postId2, day: day3 },
      ]);
      expect(sellerInstanceAt.postId).toEqual(postId2);
      expect(sellerInstanceAt.dismissDay).toBeUndefined();
    });

    test('#7', () => {
      sellerInstanceAt = Seller.instanceAt(seller, day4);

      expect(sellerInstanceAt.state).toBe(states.RECRUITED);
      expect(sellerInstanceAt.appointments).toEqual([
        { postId: postId2, day: day3 },
        { postId: postId3, day: day4 },
      ]);
      expect(sellerInstanceAt.postId).toEqual(postId3);
      expect(sellerInstanceAt.dismissDay).toBeUndefined();
    });

    test('#7', () => {
      sellerInstanceAt = Seller.instanceAt(seller, day5.prev());

      expect(sellerInstanceAt.state).toBe(states.RECRUITED);
      expect(sellerInstanceAt.appointments).toEqual([
        { postId: postId2, day: day3 },
        { postId: postId3, day: day4 },
      ]);
      expect(sellerInstanceAt.postId).toEqual(postId3);
      expect(sellerInstanceAt.dismissDay).toBeUndefined();
    });

    test('#8', () => {
      sellerInstanceAt = Seller.instanceAt(seller, day5);

      expect(sellerInstanceAt.state).toBe(states.DISMISSED);
      expect(sellerInstanceAt.appointments).toHaveLength(0);
      expect(sellerInstanceAt.postId).toBeUndefined();
      expect(sellerInstanceAt.dismissDay).toEqual(day5);
    });

    test('#9', () => {
      sellerInstanceAt = Seller.instanceAt(seller, day6.prev());

      expect(sellerInstanceAt.state).toBe(states.DISMISSED);
      expect(sellerInstanceAt.appointments).toHaveLength(0);
      expect(sellerInstanceAt.postId).toBeUndefined();
      expect(sellerInstanceAt.dismissDay).toEqual(day5);
    });

    test('#10', () => {
      sellerInstanceAt = Seller.instanceAt(seller, day6);

      expect(sellerInstanceAt.state).toBe(states.RECRUITED);
      expect(sellerInstanceAt.appointments).toEqual([
        { postId: postId4, day: day6 },
      ]);
      expect(sellerInstanceAt.postId).toEqual(postId4);
      expect(sellerInstanceAt.dismissDay).toBeUndefined();
    });
  });
});
