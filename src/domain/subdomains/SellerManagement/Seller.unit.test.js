import { SellerId, PostId, PersonName, Day } from '../../commonTypes';
import { Seller } from './Seller';
import { Post } from './Post';
import { Appointment } from './Appointment';

const lastName = 'lastName';
const firstName = 'Firstname';
const middleName = 'Middlename';
const phone = '55-66-00';

const floristPost = new Post({ name: 'Флорист' });
const seniorFloristPost = new Post({ name: 'Старший флорист' });

const newDay = new Day();
const day1 = new Day({ value: new Date('2017.01.14 11:00') });
const day2 = new Day({ value: new Date('2017.02.20 11:00') });
const day3 = new Day({ value: new Date('2017.03.14 11:00') });
const day4 = new Day({ value: new Date('2017.04.16 11:00') });
const day5 = new Day({ value: new Date('2017.05.18 11:00') });
const day6 = new Day({ value: new Date('2017.06.01 11:00') });
const day7 = new Day({ value: new Date('2017.07.01 11:00') });
const day8 = new Day({ value: new Date('2017.08.01 11:00') });
const day9 = new Day({ value: new Date('2017.09.01 11:00') });
const day10 = new Day({ value: new Date('2017.10.01 11:00') });

const quitPostId = new PostId();
PostId.quitPostId = quitPostId;

describe('Domain :: entities :: Seller', () => {
  let seller;
  let appointmentsOfQuitedSeller;
  let appointmentsOfSeller;
  let appointmentsOfSellerRecruitedAgain;

  beforeEach(() => {
    seller = new Seller({ lastName, firstName, middleName, phone });

    appointmentsOfQuitedSeller = [
      { postId: floristPost.postId, day: day2 },
      { postId: quitPostId, day: day4 },
      { postId: floristPost.postId, day: day5 },
      { postId: quitPostId, day: day6 },
    ];

    appointmentsOfSeller = [
      { postId: floristPost.postId, day: day2 },
      { postId: seniorFloristPost.postId, day: day4 },
    ];

    appointmentsOfSellerRecruitedAgain = [
      { postId: floristPost.postId, day: day2 },
      { postId: quitPostId, day: day3 },
      { postId: floristPost.postId, day: day4 },
      { postId: quitPostId, day: day6 },
      { postId: floristPost.postId, day: day7 },
    ];
  });

  describe('#constructor', () => {
    test('should be instance of Seller', () => {
      expect(seller).toBeInstanceOf(Seller);
      expect(seller.sellerId).toBeInstanceOf(SellerId);
      expect(seller.personName).toBeInstanceOf(PersonName);
      expect(seller.fullName).toBe(`${lastName} ${firstName} ${middleName}`);
      expect(seller.phone).toBe(phone);
    });
  });

  describe('#getAppointmentsAt', () => {
    context('when seller have no appointments', () => {
      context('when seller is not recruited', () => {
        context('at day', () => {
          beforeEach(() => {
            expect(seller.isRecruitedAt(day1)).toBe(false);
          });
          test('should return empty array', () => {
            expect(seller.getAppointmentsAt(day1)).toEqual([]);
          });
        });

        context('now', () => {
          beforeEach(() => {
            expect(seller.isRecruitedAt()).toBe(false);
          });
          test('should return empty array', () => {
            expect(seller.getAppointmentsAt()).toEqual([]);
          });
        });
      });

      context('when seller is quited', () => {
        beforeEach(() => {
          expect(seller.isQuitedAt(day4)).toBe(true);
          expect(seller.isRecruitedAt(day4)).toBe(false);
          expect(seller.getPostIdAt(day4)).toBeUndefined();
          expect(seller.isQuitedAt()).toBe(true);
          expect(seller.isRecruitedAt()).toBe(false);
          expect(seller.getPostIdAt()).toBeUndefined();

          seller.setAppointments(appointmentsOfQuitedSeller);
          // test('seller should be quited', () => {
          //   expect(seller.isQuitedAt(day5)).toBe(true);
          // });
          // test('seller should have not recruited at these day', () => {
          //   expect(seller.isRecruitedAt(day5)).toBe(false);
          // });
          // test('seller should have no postId', () => {
          //   expect(seller.getPostIdAt(day5)).toBeUndefined();
          // });
        });

        context('at day', () => {
          test('should return empty array', () => {
            expect(seller.getAppointmentsAt(day4)).toEqual([]);
            expect(seller.getAppointmentsAt(day6)).toEqual([]);
          });
        });

        context('now', () => {
          test('should return empty array', () => {
            expect(seller.getAppointmentsAt()).toEqual([]);
          });
        });
      });
    });

    context('when seller have appointments', () => {
      context('when seller is recruited once', () => {
        beforeEach(() => {
          seller.setAppointments(appointmentsOfSeller);
        });

        context('at day', () => {
          test('should return array with sooner appointments', () => {
            expect(seller.getAppointmentsAt(day3)).toEqual([
              { postId: floristPost.postId, day: day2 },
            ]);
          });

          test('should return array without later appointments', () => {
            expect(seller.getAppointmentsAt(day3)).not.toContainEqual([
              { postId: seniorFloristPost.postId, day: day4 },
            ]);
          });
        });

        context('now', () => {
          test('should return array containing all appointments', () => {
            expect(seller.getAppointmentsAt()).toEqual([
              { postId: floristPost.postId, day: day2 },
              { postId: seniorFloristPost.postId, day: day4 },
            ]);
          });
        });
      });

      context('when seller is recruited again', () => {
        beforeEach(() => {
          seller.setAppointments(appointmentsOfSellerRecruitedAgain);
        });

        context('at day', () => {
          test('should return array containing only appointments after recruit', () => {
            expect(seller.getAppointmentsAt(day5)).toEqual([
              { postId: floristPost.postId, day: day4 },
            ]);
          });

          test('should return array not containing appointments before quit', () => {
            expect(seller.getAppointmentsAt(day5)).not.toContainEqual([
              { postId: floristPost.postId, day: day2 },
            ]);
          });
        });

        context('now', () => {
          test('should return array containing last appointments', () => {
            expect(seller.getAppointmentsAt()).toEqual([
              { postId: floristPost.postId, day: day7 },
            ]);
          });
        });
      });
    });
  });

  describe('#appointments', () => {
    context('when seller is not recruited now', () => {
      test('should return empty array', () => {
        expect(seller.appointments).toEqual([]);
      });
    });

    context('when seller is appointed to post now', () => {
      test('should return array containing added appointment', () => {
        seller.setAppointments(appointmentsOfSeller);

        expect(seller.appointments).toContainEqual({
          postId: floristPost.postId,
          day: day2,
        });
      });
    });

    context('when seller is quited now', () => {
      test('should return empty array', () => {
        seller.setAppointments(appointmentsOfQuitedSeller);

        expect(seller.appointments).toEqual([]);
      });
    });
  });

  describe('#getPostIdAt', () => {
    context('when seller have no appointments', () => {
      context('when seller is not recruited', () => {
        context('at day', () => {
          test('should return undefined', () => {
            expect(seller.getPostIdAt(day1)).toBeUndefined();
          });
        });

        context('now', () => {
          test('should return undefined', () => {
            expect(seller.getPostIdAt()).toBeUndefined();
          });
        });
      });
      context('when seller is quited', () => {
        beforeEach(() => {
          seller.setAppointments(appointmentsOfQuitedSeller);
        });

        context('at day', () => {
          test('should return undefined', () => {
            expect(seller.getPostIdAt(day4)).toBeUndefined();
          });
        });

        context('now', () => {
          test('should return undefined', () => {
            expect(seller.getPostIdAt()).toBeUndefined();
          });
        });
      });
    });

    context('when seller have appointments', () => {
      context('when seller is recruited once', () => {
        beforeEach(() => {
          seller.setAppointments(appointmentsOfSeller);
        });
        context('at day', () => {
          test('should return sooner appointment postId', () => {
            expect(seller.getPostIdAt(day3)).toEqual(floristPost.postId);
          });

          test('should not return later appointment postId', () => {
            expect(seller.getPostIdAt(day3)).not.toBe(seniorFloristPost.postId);
          });
        });
        context('now', () => {
          test('should return postId of last appointment', () => {
            expect(seller.getPostIdAt()).toBe(seniorFloristPost.postId);
          });
        });
      });
      context('when seller is recruited again', () => {
        beforeEach(() => {
          seller.setAppointments(appointmentsOfSellerRecruitedAgain);
        });
        context('at day', () => {
          test('should return postId appointed at these day', () => {
            expect(seller.getPostIdAt(day4)).toBe(floristPost.postId);
            expect(seller.getPostIdAt(day5)).toBe(floristPost.postId);
          });
        });
        context('now', () => {
          test('should return postId of last appointment', () => {
            expect(seller.getPostIdAt()).toEqual(floristPost.postId);
          });
        });
      });
    });
  });

  describe('#postId', () => {
    context('when seller is not recruited now', () => {
      test('should return undefined', () => {
        expect(seller.postId).toBeUndefined();
      });
    });

    context('when seller is appointed to post now', () => {
      test('should return new post', () => {
        seller.setAppointments(appointmentsOfSeller);

        expect(seller.postId).toBe(seniorFloristPost.postId);
      });
    });

    context('when seller is quited now', () => {
      test('should return undefined', () => {
        seller.setAppointments(appointmentsOfQuitedSeller);

        expect(seller.postId).toBeUndefined();
      });
    });
  });

  describe('#getPostIdsAt', () => {
    context('when seller have no appointments', () => {
      context('when seller is not recruited', () => {
        context('at day', () => {
          beforeEach(() => {
            expect(seller.isRecruitedAt(day1)).toBe(false);
          });
          test('should return empty array', () => {
            expect(seller.getPostIdsAt(day1)).toEqual([]);
          });
        });

        context('now', () => {
          beforeEach(() => {
            expect(seller.isRecruitedAt()).toBe(false);
          });
          test('should return empty array', () => {
            expect(seller.getPostIdsAt()).toEqual([]);
          });
        });
      });

      context('when seller is quited', () => {
        beforeEach(() => {
          seller.setAppointments(appointmentsOfQuitedSeller);
          expect(seller.isQuitedAt(day4)).toBe(true);
          expect(seller.isRecruitedAt(day4)).toBe(false);
          expect(seller.getPostIdAt(day4)).toBeUndefined();
          expect(seller.isQuitedAt()).toBe(true);
          expect(seller.isRecruitedAt()).toBe(false);
          expect(seller.getPostIdAt()).toBeUndefined();

          // test('seller should be quited', () => {
          //   expect(seller.isQuitedAt(day5)).toBe(true);
          // });
          // test('seller should have not recruited at these day', () => {
          //   expect(seller.isRecruitedAt(day5)).toBe(false);
          // });
          // test('seller should have no postId', () => {
          //   expect(seller.getPostIdAt(day5)).toBeUndefined();
          // });
        });

        context('at day', () => {
          test('should return empty array', () => {
            expect(seller.getPostIdsAt(day4)).toEqual([]);
            expect(seller.getPostIdsAt(day6)).toEqual([]);
          });
        });

        context('now', () => {
          test('should return empty array', () => {
            expect(seller.getPostIdsAt()).toEqual([]);
            expect(seller.getPostIdsAt()).toEqual([]);
          });
        });
      });
    });

    context('when seller have appointments', () => {
      context('when seller is recruited once', () => {
        beforeEach(() => {
          seller.setAppointments(appointmentsOfSeller);
        });

        context('at day', () => {
          test('should return array with sooner appointment postIds', () => {
            expect(seller.getPostIdsAt(day3)).toEqual([floristPost.postId]);
          });

          test('should return array without later appointment postId', () => {
            expect(seller.getPostIdsAt(day3)).not.toContainEqual(
              seniorFloristPost.postId
            );
          });
        });

        context('now', () => {
          test('should return array ended by last appointment postId', () => {
            expect(seller.getPostIdsAt()).toEqual([
              floristPost.postId,
              seniorFloristPost.postId,
            ]);
          });
        });
      });

      context('when seller is recruited again', () => {
        beforeEach(() => {
          seller.setAppointments(appointmentsOfSellerRecruitedAgain);
        });

        context('at day', () => {
          test('should return array containing only appointments postIds after recruit', () => {
            expect(seller.getPostIdsAt(day5)).toEqual([floristPost.postId]);
          });
        });

        context('now', () => {
          test('should return array containing last appointments', () => {
            expect(seller.getPostIdsAt()).toEqual([floristPost.postId]);
          });
        });
      });
    });
  });

  describe('#postIds', () => {
    context('when seller is not recruited now', () => {
      test('should return empty array', () => {
        expect(seller.postIds).toEqual([]);
      });
    });

    context('when seller is appointed to post now', () => {
      test('should return array containing new postId', () => {
        seller.setAppointments(appointmentsOfSeller);

        expect(seller.postIds).toEqual([
          floristPost.postId,
          seniorFloristPost.postId,
        ]);
      });
    });

    context('when seller is quited now', () => {
      test('should return empty array', () => {
        seller.setAppointments(appointmentsOfQuitedSeller);

        expect(seller.postIds).toEqual([]);
      });
    });
  });

  describe('#getRecruitDayAt', () => {
    context('when seller have no appointments', () => {
      context('when seller is not recruited', () => {
        context('at day', () => {
          test('should return undefined', () => {
            expect(seller.getRecruitDayAt(day1)).toBeUndefined();
          });
        });

        context('now', () => {
          test('should return undefined', () => {
            expect(seller.getRecruitDayAt()).toBeUndefined();
          });
        });
      });
      context('when seller is quited', () => {
        beforeEach(() => {
          seller.setAppointments(appointmentsOfQuitedSeller);
        });

        context('at day', () => {
          test('should return undefined', () => {
            expect(seller.getRecruitDayAt(day4)).toBeUndefined();
          });
        });

        context('now', () => {
          test('should return undefined', () => {
            expect(seller.getRecruitDayAt()).toBeUndefined();
          });
        });
      });
    });

    context('when seller have appointments', () => {
      context('when seller is recruited once', () => {
        beforeEach(() => {
          seller.setAppointments(appointmentsOfSeller);
        });
        context('at day', () => {
          test('should return first appointment day', () => {
            expect(seller.getRecruitDayAt(day3)).toBe(day2);
          });

          test('should not return other appointment day', () => {
            expect(seller.getRecruitDayAt(day3)).not.toBe(day4);
          });
        });
        context('now', () => {
          test('should return first appointment day', () => {
            expect(seller.getRecruitDayAt()).toBe(day2);
          });
        });
      });
      context('when seller is recruited again', () => {
        beforeEach(() => {
          seller.setAppointments(appointmentsOfSellerRecruitedAgain);
        });
        context('at day', () => {
          test('should return current first appointment day after quit', () => {
            expect(seller.getRecruitDayAt(day4)).toBe(day4);
            expect(seller.getRecruitDayAt(day5)).toBe(day4);
          });
          test('should not return previuos first appointment day', () => {
            expect(seller.getRecruitDayAt(day7)).not.toBe(day2);
            expect(seller.getRecruitDayAt(day7)).not.toBe(day4);
          });
        });
        context('now', () => {
          test('should return current first appointment day', () => {
            expect(seller.getRecruitDayAt()).toBe(day7);
          });
        });
      });
    });
  });

  describe('#recruitDay', () => {
    context('when seller is not recruited now', () => {
      test('should return undefined', () => {
        expect(seller.recruitDay).toBe(undefined);
      });
    });

    context('when seller is appointed to post now', () => {
      test('should return first appointment day', () => {
        seller.setAppointments(appointmentsOfSeller);

        expect(seller.recruitDay).toBe(day2);
      });
    });

    context('when seller is quited now', () => {
      test('should return undefined', () => {
        seller.setAppointments(appointmentsOfQuitedSeller);

        expect(seller.recruitDay).toBe(undefined);
      });
    });
  });

  describe('#isRecruitedAt', () => {
    context('when seller have no appointments', () => {
      context('when seller is not recruited', () => {
        context('at day', () => {
          test('should return false', () => {
            expect(seller.isRecruitedAt(day1)).toBe(false);
          });
        });

        context('now', () => {
          test('should return false', () => {
            expect(seller.isRecruitedAt()).toBe(false);
          });
        });
      });

      context('when seller is quited', () => {
        beforeEach(() => {
          seller.setAppointments(appointmentsOfQuitedSeller);
        });

        context('at day', () => {
          test('should return false', () => {
            expect(seller.isRecruitedAt(day4)).toBe(false);
          });
        });

        context('now', () => {
          test('should return false', () => {
            expect(seller.isRecruitedAt()).toBe(false);
          });
        });
      });
    });

    context('when seller have appointments', () => {
      context('when seller is recruited once', () => {
        beforeEach(() => {
          seller.setAppointments(appointmentsOfSeller);
        });
        context('at day', () => {
          test('should return true', () => {
            expect(seller.isRecruitedAt(day3)).toBe(true);
          });
        });
        context('now', () => {
          test('should return true', () => {
            expect(seller.isRecruitedAt()).toBe(true);
          });
        });
      });
      context('when seller is recruited again', () => {
        beforeEach(() => {
          seller.setAppointments(appointmentsOfSellerRecruitedAgain);
        });
        context('at day', () => {
          test('should return true', () => {
            expect(seller.isRecruitedAt(day4)).toBe(true);
            expect(seller.isRecruitedAt(day5)).toBe(true);
          });
        });
        context('now', () => {
          test('should return true', () => {
            expect(seller.isRecruitedAt()).toBe(true);
          });
        });
      });
    });
  });

  describe('#isRecruited', () => {
    context('when seller is not recruited now', () => {
      test('should return false', () => {
        expect(seller.isRecruited).toBe(false);
      });
    });

    context('when seller is appointed to post now', () => {
      test('should return true', () => {
        seller.setAppointments(appointmentsOfSeller);

        expect(seller.isRecruited).toBe(true);
      });
    });

    context('when seller is quited now', () => {
      test('should return false', () => {
        seller.setAppointments(appointmentsOfQuitedSeller);

        expect(seller.isRecruited).toBe(false);
      });
    });
  });

  describe('#getQuitDayAt', () => {
    context('when seller have no appointments', () => {
      context('when seller is not recruited', () => {
        context('at day', () => {
          test('should return undefined', () => {
            expect(seller.getQuitDayAt(day1)).toBeUndefined();
          });
        });

        context('now', () => {
          test('should return undefined', () => {
            expect(seller.getQuitDayAt()).toBeUndefined();
          });
        });
      });
      context('when seller is quited', () => {
        beforeEach(() => {
          seller.setAppointments(appointmentsOfQuitedSeller);
        });

        context('at day', () => {
          test('should return quit day', () => {
            expect(seller.getQuitDayAt(day4)).toBe(day4);
            expect(seller.getQuitDayAt(day7)).toBe(day6);
          });

          test('should not return previous quit day', () => {
            expect(seller.getQuitDayAt(day6)).not.toBe(day4);
          });
        });

        context('now', () => {
          test('should return last quit day', () => {
            expect(seller.getQuitDayAt()).toBe(day6);
          });
        });
      });
    });

    context('when seller have appointments', () => {
      context('when seller is recruited once', () => {
        beforeEach(() => {
          seller.setAppointments(appointmentsOfSeller);
        });

        context('at day', () => {
          test('should return undefined', () => {
            expect(seller.getQuitDayAt(day3)).toBeUndefined();
          });
        });

        context('now', () => {
          test('should return undefined', () => {
            expect(seller.getQuitDayAt()).toBeUndefined();
          });
        });
      });

      context('when seller is recruited again', () => {
        beforeEach(() => {
          seller.setAppointments(appointmentsOfSellerRecruitedAgain);
        });

        context('at day', () => {
          test('should return undefined', () => {
            expect(seller.getQuitDayAt(day4)).toBeUndefined();
            expect(seller.getQuitDayAt(day5)).toBeUndefined();
          });

          test('should not return previous quit day', () => {
            expect(seller.getQuitDayAt(day7)).not.toBe(day3);
            expect(seller.getQuitDayAt(day7)).not.toBe(day6);
          });
        });

        context('now', () => {
          test('should return undefined', () => {
            expect(seller.getQuitDayAt()).toBeUndefined();
          });
        });
      });
    });
  });

  describe('#quitDay', () => {
    context('when seller is not recruited now', () => {
      test('should return undefined', () => {
        expect(seller.quitDay).toBe(undefined);
      });
    });

    context('when seller is appointed to post now', () => {
      test('should return undefined', () => {
        seller.setAppointments(appointmentsOfSeller);

        expect(seller.quitDay).toBe(undefined);
      });
    });

    context('when seller is quited now', () => {
      beforeEach(() => {
        seller.setAppointments(appointmentsOfQuitedSeller);
      });
      test('should return day when seller took quit', () => {
        expect(seller.quitDay).toBe(day6);
      });
    });
  });

  describe('#isQuitedAt', () => {
    context('when seller have no appointments', () => {
      context('when seller is not recruited', () => {
        context('at day', () => {
          test('should return false', () => {
            expect(seller.isQuitedAt(day1)).toBe(false);
          });
        });

        context('now', () => {
          test('should return false', () => {
            expect(seller.isQuitedAt()).toBe(false);
          });
        });
      });
      context('when seller is quited', () => {
        beforeEach(() => {
          seller.setAppointments(appointmentsOfQuitedSeller);
        });

        context('at day', () => {
          test('should return true', () => {
            expect(seller.isQuitedAt(day4)).toBe(true);
            expect(seller.isQuitedAt(day7)).toBe(true);
          });
        });

        context('now', () => {
          test('should return true', () => {
            expect(seller.isQuitedAt()).toBe(true);
          });
        });
      });
    });

    context('when seller have appointments', () => {
      context('when seller is recruited once', () => {
        beforeEach(() => {
          seller.setAppointments(appointmentsOfSeller);
        });

        context('at day', () => {
          test('should return false', () => {
            expect(seller.isQuitedAt(day3)).toBe(false);
          });
        });

        context('now', () => {
          test('should return false', () => {
            expect(seller.isQuitedAt()).toBe(false);
          });
        });
      });

      context('when seller is recruited again', () => {
        beforeEach(() => {
          seller.setAppointments(appointmentsOfSellerRecruitedAgain);
        });

        context('at day', () => {
          test('should return false', () => {
            expect(seller.isQuitedAt(day4)).toBe(false);
            expect(seller.isQuitedAt(day5)).toBe(false);
          });
        });

        context('now', () => {
          test('should return false', () => {
            expect(seller.isQuitedAt()).toBe(false);
          });
        });
      });
    });
  });

  describe('#isQuited', () => {
    context('when seller is not recruited now', () => {
      test('should return false', () => {
        expect(seller.isQuited).toBe(false);
      });
    });

    context('when seller is appointed to post now', () => {
      test('should return false', () => {
        seller.setAppointments(appointmentsOfSeller);

        expect(seller.isQuited).toBe(false);
      });
    });

    context('when seller is quited now', () => {
      test('should return true', () => {
        seller.setAppointments(appointmentsOfQuitedSeller);

        expect(seller.isQuited).toBe(true);
      });
    });
  });

  describe('#getSeniorityAt', () => {
    context('when seller have no appointments', () => {
      context('when seller is not recruited', () => {
        context('at day', () => {
          test('should return undefined', () => {
            expect(seller.getSeniorityAt(day1)).toBeUndefined();
          });
        });

        context('now', () => {
          test('should return undefined', () => {
            expect(seller.getSeniorityAt()).toBeUndefined();
          });
        });
      });
      context('when seller is quited', () => {
        beforeEach(() => {
          seller.setAppointments(appointmentsOfQuitedSeller);
        });

        context('at day', () => {
          test('should return undefined', () => {
            expect(seller.getSeniorityAt(day4)).toBeUndefined();
            expect(seller.getSeniorityAt(day7)).toBeUndefined();
          });
        });

        context('now', () => {
          test('should return undefined', () => {
            expect(seller.getSeniorityAt()).toBeUndefined();
          });
        });
      });
    });

    context('when seller have appointments', () => {
      context('when seller is recruited once', () => {
        beforeEach(() => {
          seller.setAppointments(appointmentsOfSeller);
        });

        context('at day', () => {
          test('should not return undefined', () => {
            expect(seller.getSeniorityAt(day3)).not.toBeUndefined();
          });

          test('should return 0 at recruit Day', () => {
            expect(seller.getSeniorityAt(day2)).toBe(0);
          });

          test('should return increased value later', () => {
            expect(seller.getSeniorityAt(day9)).toBeGreaterThan(
              seller.getSeniorityAt(day4)
            );
          });
        });

        context('now', () => {
          test('should not return undefined', () => {
            expect(seller.getSeniorityAt()).not.toBeUndefined();
          });
        });
      });

      context('when seller is recruited again', () => {
        beforeEach(() => {
          seller.setAppointments(appointmentsOfSellerRecruitedAgain);
        });

        context('at day', () => {
          test('should not return undefined', () => {
            expect(seller.getSeniorityAt(day4)).not.toBeUndefined();
          });

          test('should return 0 at new recruit Day', () => {
            expect(seller.getSeniorityAt(day7)).toBe(0);
          });
        });

        context('now', () => {
          test('should not return undefined', () => {
            expect(seller.getSeniorityAt()).not.toBeUndefined();
          });

          test('should return bigger value', () => {
            expect(seller.getSeniorityAt()).toBeGreaterThan(
              seller.getSeniorityAt(day7)
            );
          });
        });
      });
    });
  });

  describe('#seniority', () => {
    context('when seller is not recruited now', () => {
      test('should return undefined', () => {
        expect(seller.seniority).toBeUndefined();
      });
    });

    context('when seller is appointed to post now', () => {
      test('should not return undefined', () => {
        seller.setAppointments(appointmentsOfSeller);

        expect(seller.seniority).not.toBeUndefined();
      });
    });

    context('when seller is quited now', () => {
      test('should return undefined', () => {
        seller.setAppointments(appointmentsOfQuitedSeller);

        expect(seller.seniority).toBeUndefined();
      });
    });
  });

  describe('#addAppointment', () => {
    beforeEach(() => {
      seller.addAppointment(floristPost.postId, day1);
    });

    context('when seller appointed to postId', () => {
      test('should recruit seller', () => {
        expect(seller.isRecruitedAt()).toBe(true);
        expect(seller.recruitDay).toBe(day1);
      });

      test('should return seniority not undefined', () => {
        expect(seller.getSeniorityAt(day1)).not.toBeUndefined();
      });

      test('should have appointments length equal to 1', () => {
        expect(seller.appointments).toHaveLength(1);
      });
    });

    // context('when appoint to same postId at same date', () => {
    //   test('should throw exeption', () => {
    //     try {
    //       seller.addAppointment(floristPost.postId, day1);
    //     } catch (e) {
    //       expect(e.details).toEqual(['Seller already have this post']);
    //       expect(seller.appointments).toHaveLength(1);
    //     }
    //   });
    // });

    // context('when appoint to same postId at another date', () => {
    //   test('should throw exeption', () => {
    //     try {
    //       seller.addAppointment(floristPost.postId, newDay);
    //     } catch (e) {
    //       expect(e.details).toEqual(['Seller already have this post']);
    //       expect(seller.appointments).toHaveLength(1);
    //     }
    //   });
    // });
  });

  describe('#editAppointment', () => {
    beforeEach(() => {
      seller.addAppointment(floristPost.postId, day1);
    });

    context('when appointment has created with wrong postId', () => {
      test('should change associated postId', () => {
        seller.editAppointment(
          floristPost.postId,
          day1,
          seniorFloristPost.postId,
          day1
        );

        expect(seller.appointments).toHaveLength(1);
        expect(seller.appointments[0].day).toEqual(day1);
        expect(seller.getPostIdAt()).toBe(seniorFloristPost.postId);
      });
    });

    context('when appointment has created with wrong date', () => {
      test('should change associated date', () => {
        seller.editAppointment(
          floristPost.postId,
          day1,
          floristPost.postId,
          day2
        );
        expect(seller.appointments).toHaveLength(1);
        expect(seller.getPostIdAt(day1)).toEqual(undefined);
        expect(seller.getPostIdAt(day2)).toBe(floristPost.postId);
      });
    });
  });

  describe('#deleteAppointment', () => {
    beforeEach(() => {
      seller.addAppointment(floristPost.postId, day1);
      seller.addAppointment(seniorFloristPost.postId, day2);
      seller.addAppointment(floristPost.postId, day3);
    });

    context('when delete existing appointment', () => {
      test('should decrease appointments length', () => {
        expect(seller.appointments).toHaveLength(3);

        seller.deleteAppointment(floristPost.postId, day3);

        expect(seller.getPostIdAt()).toBe(seniorFloristPost.postId);
        expect(seller.appointments).toHaveLength(2);
      });
    });

    // context('when delete appointment twice', () => {
    //   test('should throw exeption', () => {
    //     seller.deleteAppointment(floristPost.postId, day3);

    //     try {
    //       seller.deleteAppointment(floristPost.postId, day3);
    //     } catch (e) {
    //       expect(e.details).toEqual([
    //         'Seller have not such appointment to this postId',
    //       ]);
    //       expect(seller.appointments).toHaveLength(2);
    //     }
    //   });
    // });
  });

  describe('#takeQuit', () => {
    context('when seller have appointments', () => {
      beforeEach(() => {
        seller.addAppointment(floristPost.postId, day1);
        seller.addAppointment(seniorFloristPost.postId, day2);
      });

      test('should be add quitPostId', () => {
        seller.takeQuit(newDay);

        expect(seller.quitDay).toEqual(newDay);
        expect(seller.appointments).toHaveLength(3);
      });

      // test('should throw exeption if quit day before reqruit day', () => {
      //   try {
      //     seller.takeQuit(day1.prev());
      //   } catch (e) {
      //     expect(e.details).toEqual([
      //       'Seller cannot take quit before get recruit or on the same day',
      //     ]);
      //     expect(seller.quitDay).toBeUndefined();
      //     expect(seller.appointments).toHaveLength(2);
      //   }
      // });
    });

    // context('when seller have no appointments', () => {
    //   test('should throw exeption', () => {
    //     try {
    //       seller.takeQuit(day1.prev());
    //     } catch (e) {
    //       expect(e.details).toEqual([
    //         'Seller cannot take quit before get recruit or on the same day',
    //       ]);
    //       expect(seller.quitDay).toBeUndefined();
    //       expect(seller.reqruitDay).toBeUndefined();
    //       expect(seller.appointments).toHaveLength(0);
    //     }
    //   });
    // });
  });

  // describe('#setAppointments', () => {});
});
