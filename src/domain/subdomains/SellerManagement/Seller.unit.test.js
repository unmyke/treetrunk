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

const dismissPostId = new PostId();
PostId.dismissPostId = dismissPostId;

describe('Domain :: entities :: Seller', () => {
  let seller;
  let appointmentsOfDismissedSeller;
  let appointmentsOfSeller;
  let appointmentsOfSellerRecruitedAgain;

  beforeEach(() => {
    seller = new Seller({ lastName, firstName, middleName, phone });

    appointmentsOfDismissedSeller = [
      { postId: floristPost.postId, day: day2 },
      { postId: dismissPostId, day: day4 },
      { postId: floristPost.postId, day: day5 },
      { postId: dismissPostId, day: day6 },
    ];

    appointmentsOfSeller = [
      { postId: floristPost.postId, day: day2 },
      { postId: seniorFloristPost.postId, day: day4 },
    ];

    appointmentsOfSellerRecruitedAgain = [
      { postId: floristPost.postId, day: day2 },
      { postId: dismissPostId, day: day3 },
      { postId: floristPost.postId, day: day4 },
      { postId: dismissPostId, day: day6 },
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
    context('when seller is not recruited', () => {
      context('at day', () => {
        beforeEach(() => {
          expect(seller.isRecruitedAt(day1)).toBeFalsy();
        });
        test('should return empty array', () => {
          expect(seller.getAppointmentsAt(day1)).toEqual([]);
        });
      });

      context('now', () => {
        beforeEach(() => {
          expect(seller.isRecruitedAt()).toBeFalsy();
        });
        test('should return empty array', () => {
          expect(seller.getAppointmentsAt()).toEqual([]);
        });
      });
    });

    context('when seller is dismissed', () => {
      beforeEach(() => {
        seller.setAppointments(appointmentsOfDismissedSeller);

        expect(seller.isDismissedAt(day4)).toBeTruthy();
        expect(seller.isRecruitedAt(day4)).toBeFalsy();
        expect(seller.getPostIdAt(day4)).toBeUndefined();
        expect(seller.isDismissedAt()).toBeTruthy();
        expect(seller.isRecruitedAt()).toBeFalsy();
        expect(seller.getPostIdAt()).toBeUndefined();

        // test('seller should be dismissed', () => {
        //   expect(seller.isDismissedAt(day5)).toBeTruthy();
        // });
        // test('seller should have not recruited at these day', () => {
        //   expect(seller.isRecruitedAt(day5)).toBeFalsy();
        // });
        // test('seller should have no postId', () => {
        //   expect(seller.getPostIdAt(day5)).toBeUndefined();
        // });
      });

      context('at day', () => {
        test('should return empty array containing dismiss', () => {
          expect(seller.getAppointmentsAt(day4)).toHaveLength(0);

          expect(seller.getAppointmentsAt(day6)).toHaveLength(0);
        });
      });

      context('now', () => {
        test('should return empty array containing', () => {
          expect(seller.getAppointmentsAt()).toHaveLength(0);
        });
      });
    });

    context('when seller is recruited once', () => {
      beforeEach(() => {
        seller.setAppointments(appointmentsOfSeller);
      });

      context('at day', () => {
        test('should return array with sooner appointments', () => {
          expect(seller.getAppointmentsAt(day3)).toEqual([
            { value: floristPost.postId, day: day2 },
          ]);
        });

        test('should return array without later appointments', () => {
          expect(seller.getAppointmentsAt(day3)).not.toContainEqual([
            { value: seniorFloristPost.postId, day: day4 },
          ]);
        });
      });

      context('now', () => {
        test('should return array containing all appointments', () => {
          expect(seller.getAppointmentsAt()).toEqual([
            { value: floristPost.postId, day: day2 },
            { value: seniorFloristPost.postId, day: day4 },
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
            { value: floristPost.postId, day: day4 },
          ]);
        });

        test('should return array not containing appointments before dismiss', () => {
          expect(seller.getAppointmentsAt(day5)).not.toContainEqual([
            { value: floristPost.postId, day: day2 },
          ]);
        });
      });

      context('now', () => {
        test('should return array containing last appointments', () => {
          expect(seller.getAppointmentsAt()).toEqual([
            { value: floristPost.postId, day: day7 },
          ]);
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

    context('when seller is dismissed now', () => {
      test('should return array containing dismiss', () => {
        seller.setAppointments(appointmentsOfDismissedSeller);

        expect(seller.appointments).toHaveLength(0);
      });
    });
  });

  describe('#getPostIdAt', () => {
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

    context('when seller is dismissed', () => {
      beforeEach(() => {
        seller.setAppointments(appointmentsOfDismissedSeller);
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

    context('when seller is dismissed now', () => {
      test('should return undefined', () => {
        seller.setAppointments(appointmentsOfDismissedSeller);

        expect(seller.postId).toBeUndefined();
      });
    });
  });

  describe('#getPostIdsAt', () => {
    context('when seller is not recruited', () => {
      context('at day', () => {
        beforeEach(() => {
          expect(seller.isRecruitedAt(day1)).toBeFalsy();
        });
        test('should return empty array', () => {
          expect(seller.getPostIdsAt(day1)).toEqual([]);
        });
      });

      context('now', () => {
        beforeEach(() => {
          expect(seller.isRecruitedAt()).toBeFalsy();
        });
        test('should return empty array', () => {
          expect(seller.getPostIdsAt()).toEqual([]);
        });
      });
    });

    context('when seller is dismissed', () => {
      beforeEach(() => {
        seller.setAppointments(appointmentsOfDismissedSeller);
        expect(seller.isDismissedAt(day4)).toBeTruthy();
        expect(seller.isRecruitedAt(day4)).toBeFalsy();
        expect(seller.getPostIdAt(day4)).toBeUndefined();
        expect(seller.isDismissedAt()).toBeTruthy();
        expect(seller.isRecruitedAt()).toBeFalsy();
        expect(seller.getPostIdAt()).toBeUndefined();

        // test('seller should be dismissed', () => {
        //   expect(seller.isDismissedAt(day5)).toBeTruthy();
        // });
        // test('seller should have not recruited at these day', () => {
        //   expect(seller.isRecruitedAt(day5)).toBeFalsy();
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

    context('when seller is dismissed now', () => {
      test('should return empty array', () => {
        seller.setAppointments(appointmentsOfDismissedSeller);

        expect(seller.postIds).toEqual([]);
      });
    });
  });

  describe('#getRecruitDayAt', () => {
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

    context('when seller is dismissed', () => {
      beforeEach(() => {
        seller.setAppointments(appointmentsOfDismissedSeller);
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
        test('should return current first appointment day after dismiss', () => {
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

    context('when seller is dismissed now', () => {
      test('should return undefined', () => {
        seller.setAppointments(appointmentsOfDismissedSeller);

        expect(seller.recruitDay).toBe(undefined);
      });
    });
  });

  describe('#isRecruitedAt', () => {
    context('when seller is not recruited', () => {
      context('at day', () => {
        test('should return false', () => {
          expect(seller.isRecruitedAt(day1)).toBeFalsy();
        });
      });

      context('now', () => {
        test('should return false', () => {
          expect(seller.isRecruitedAt()).toBeFalsy();
        });
      });
    });

    context('when seller is dismissed', () => {
      beforeEach(() => {
        seller.setAppointments(appointmentsOfDismissedSeller);
      });

      context('at day', () => {
        test('should return false', () => {
          expect(seller.isRecruitedAt(day4)).toBeFalsy();
        });
      });

      context('now', () => {
        test('should return false', () => {
          expect(seller.isRecruitedAt()).toBeFalsy();
        });
      });
    });

    context('when seller is recruited once', () => {
      beforeEach(() => {
        seller.setAppointments(appointmentsOfSeller);
      });
      context('at day', () => {
        test('should return true', () => {
          expect(seller.isRecruitedAt(day3)).toBeTruthy();
        });
      });
      context('now', () => {
        test('should return true', () => {
          expect(seller.isRecruitedAt()).toBeTruthy();
        });
      });
    });

    context('when seller is recruited again', () => {
      beforeEach(() => {
        seller.setAppointments(appointmentsOfSellerRecruitedAgain);
      });
      context('at day', () => {
        test('should return true', () => {
          expect(seller.isRecruitedAt(day4)).toBeTruthy();
          expect(seller.isRecruitedAt(day5)).toBeTruthy();
        });
      });
      context('now', () => {
        test('should return true', () => {
          expect(seller.isRecruitedAt()).toBeTruthy();
        });
      });
    });
  });

  describe('#isRecruited', () => {
    context('when seller is not recruited now', () => {
      test('should return false', () => {
        expect(seller.isRecruited).toBeFalsy();
      });
    });

    context('when seller is appointed to post now', () => {
      test('should return true', () => {
        seller.setAppointments(appointmentsOfSeller);

        expect(seller.isRecruited).toBeTruthy();
      });
    });

    context('when seller is dismissed now', () => {
      test('should return false', () => {
        seller.setAppointments(appointmentsOfDismissedSeller);

        expect(seller.isRecruited).toBeFalsy();
      });
    });
  });

  describe('#getDismissDayAt', () => {
    context('when seller is not recruited', () => {
      context('at day', () => {
        test('should return undefined', () => {
          expect(seller.getDismissDayAt(day1)).toBeUndefined();
        });
      });

      context('now', () => {
        test('should return undefined', () => {
          expect(seller.getDismissDayAt()).toBeUndefined();
        });
      });
    });

    context('when seller is dismissed', () => {
      beforeEach(() => {
        seller.setAppointments(appointmentsOfDismissedSeller);
      });

      context('at day', () => {
        test('should return dismiss day', () => {
          expect(seller.getDismissDayAt(day4)).toBe(day4);
          expect(seller.getDismissDayAt(day7)).toBe(day6);
        });

        test('should not return previous dismiss day', () => {
          expect(seller.getDismissDayAt(day6)).not.toBe(day4);
        });
      });

      context('now', () => {
        test('should return last dismiss day', () => {
          expect(seller.getDismissDayAt()).toBe(day6);
        });
      });
    });

    context('when seller is recruited once', () => {
      beforeEach(() => {
        seller.setAppointments(appointmentsOfSeller);
      });

      context('at day', () => {
        test('should return undefined', () => {
          expect(seller.getDismissDayAt(day3)).toBeUndefined();
        });
      });

      context('now', () => {
        test('should return undefined', () => {
          expect(seller.getDismissDayAt()).toBeUndefined();
        });
      });
    });

    context('when seller is recruited again', () => {
      beforeEach(() => {
        seller.setAppointments(appointmentsOfSellerRecruitedAgain);
      });

      context('at day', () => {
        test('should return undefined', () => {
          expect(seller.getDismissDayAt(day4)).toBeUndefined();
          expect(seller.getDismissDayAt(day5)).toBeUndefined();
        });

        test('should not return previous dismiss day', () => {
          expect(seller.getDismissDayAt(day7)).not.toBe(day3);
          expect(seller.getDismissDayAt(day7)).not.toBe(day6);
        });
      });

      context('now', () => {
        test('should return undefined', () => {
          expect(seller.getDismissDayAt()).toBeUndefined();
        });
      });
    });
  });

  describe('#dismissDay', () => {
    context('when seller is not recruited now', () => {
      test('should return undefined', () => {
        expect(seller.dismissDay).toBe(undefined);
      });
    });

    context('when seller is appointed to post now', () => {
      test('should return undefined', () => {
        seller.setAppointments(appointmentsOfSeller);

        expect(seller.dismissDay).toBe(undefined);
      });
    });

    context('when seller is dismissed now', () => {
      beforeEach(() => {
        seller.setAppointments(appointmentsOfDismissedSeller);
      });
      test('should return day when seller took dismiss', () => {
        expect(seller.dismissDay).toBe(day6);
      });
    });
  });

  describe('#isDismissedAt', () => {
    context('when seller is not recruited', () => {
      context('at day', () => {
        test('should return false', () => {
          expect(seller.isDismissedAt(day1)).toBeFalsy();
        });
      });

      context('now', () => {
        test('should return false', () => {
          expect(seller.isDismissedAt()).toBeFalsy();
        });
      });
    });

    context('when seller is dismissed', () => {
      beforeEach(() => {
        seller.setAppointments(appointmentsOfDismissedSeller);
      });

      context('at day', () => {
        test('should return true', () => {
          expect(seller.isDismissedAt(day4)).toBeTruthy();
          expect(seller.isDismissedAt(day7)).toBeTruthy();
        });
      });

      context('now', () => {
        test('should return true', () => {
          expect(seller.isDismissedAt()).toBeTruthy();
        });
      });
    });

    context('when seller is recruited once', () => {
      beforeEach(() => {
        seller.setAppointments(appointmentsOfSeller);
      });

      context('at day', () => {
        test('should return false', () => {
          expect(seller.isDismissedAt(day3)).toBeFalsy();
        });
      });

      context('now', () => {
        test('should return false', () => {
          expect(seller.isDismissedAt()).toBeFalsy();
        });
      });
    });

    context('when seller is recruited again', () => {
      beforeEach(() => {
        seller.setAppointments(appointmentsOfSellerRecruitedAgain);
      });

      context('at day', () => {
        test('should return false', () => {
          expect(seller.isDismissedAt(day4)).toBeFalsy();
          expect(seller.isDismissedAt(day5)).toBeFalsy();
        });
      });

      context('now', () => {
        test('should return false', () => {
          expect(seller.isDismissedAt()).toBeFalsy();
        });
      });
    });
  });

  describe('#isDismissed', () => {
    context('when seller is not recruited now', () => {
      test('should return false', () => {
        expect(seller.isDismissed).toBeFalsy();
      });
    });

    context('when seller is appointed to post now', () => {
      test('should return false', () => {
        seller.setAppointments(appointmentsOfSeller);

        expect(seller.isDismissed).toBeFalsy();
      });
    });

    context('when seller is dismissed now', () => {
      test('should return true', () => {
        seller.setAppointments(appointmentsOfDismissedSeller);

        expect(seller.isDismissed).toBeTruthy();
      });
    });
  });

  describe('#getSeniorityAt', () => {
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
    context('when seller is dismissed', () => {
      beforeEach(() => {
        seller.setAppointments(appointmentsOfDismissedSeller);
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

    context('when seller is dismissed now', () => {
      test('should return undefined', () => {
        seller.setAppointments(appointmentsOfDismissedSeller);

        expect(seller.seniority).toBeUndefined();
      });
    });
  });

  describe('#addAppointment', () => {
    context('when seller is not recruited', () => {
      beforeEach(() => {
        seller.addAppointment(floristPost.postId, day2);

        expect(seller.isRecruitedAt(day1)).toBeFalsy();
        expect(seller.getRecruitDayAt(day1)).toBeUndefined();
        expect(seller.getPostIdAt(day1)).toBeUndefined();
        expect(seller.getPostIdsAt(day1)).toEqual([]);
        expect(seller.getPostIdsAt(day1)).toHaveLength(0);
        expect(seller.getAppointmentsAt(day1)).toEqual([]);
        expect(seller.getAppointmentsAt(day1)).toHaveLength(0);
        expect(seller.getSeniorityAt(day1)).toBeUndefined();
      });

      test('should recruit seller', () => {
        expect(seller.isRecruited).toBeTruthy();
      });

      test('should set recruit day', () => {
        expect(seller.recruitDay).toBe(day2);
      });

      test('should set postId', () => {
        expect(seller.postId).toBe(floristPost.postId);
      });

      test('should change appointments', () => {
        expect(seller.appointments).toEqual([
          { value: floristPost.postId, day: day2 },
        ]);
        expect(seller.appointments).toHaveLength(1);
      });

      test('should change postIds', () => {
        expect(seller.postIds).toEqual([floristPost.postId]);
        expect(seller.postIds).toHaveLength(1);
      });

      test('should start seniority', () => {
        expect(seller.seniority).not.toBeUndefined();
      });
    });

    context('when seller is recruited once', () => {
      beforeEach(() => {
        seller.setAppointments(appointmentsOfSeller);

        expect(seller.isRecruited).toBeTruthy();
        expect(seller.postId).toBeTruthy();
      });

      context('when appointment already exist at passed day ', () => {
        test('should return exception', () => {
          expect(() => {
            seller.addAppointment(floristPost.postId, day4);
          }).toThrowError();
        });
      });

      context('when no appointment exist at passed day ', () => {
        context('when passed postId is the same as appointed', () => {
          test('should return exception', () => {
            expect(() => {
              seller.addAppointment(floristPost.postId, day6);
            }).toThrowError();
          });
        });

        context('when passed postId is not the same as appointed', () => {
          test('should change postId', () => {
            seller.addAppointment(floristPost.postId, day6);

            expect(seller.postId).toBe(floristPost.postId);
          });
        });
      });
    });

    context('when seller is dismissed', () => {
      beforeEach(() => {
        seller.setAppointments(appointmentsOfDismissedSeller);
        expect(seller.isRecruited).toBeFalsy();
        expect(seller.isDismissed).toBeTruthy();
        expect(seller.postId).toBeUndefined();
        expect(seller.dismissDay).toBeTruthy();

        seller.addAppointment(floristPost.postId, day7);
      });

      test('should recruit seller', () => {
        expect(seller.isRecruited).toBeTruthy();
      });

      test('should set postId', () => {
        expect(seller.postId).toBe(floristPost.postId);
      });

      test('should make seller not dismissed', () => {
        expect(seller.isDismissed).toBeFalsy();
        expect(seller.dismissDay).toBeUndefined();
      });

      test('should change appointments', () => {
        expect(seller.appointments).toEqual([
          { value: floristPost.postId, day: day7 },
        ]);
        expect(seller.appointments).toHaveLength(1);
      });

      test('should change postIds', () => {
        expect(seller.postIds).toEqual([floristPost.postId]);
        expect(seller.postIds).toHaveLength(1);
      });

      test('should start seniority again', () => {
        expect(seller.seniority).not.toBeUndefined();
      });
    });

    context('when seller is recruited again', () => {
      beforeEach(() => {
        seller.setAppointments(appointmentsOfSellerRecruitedAgain);

        expect(seller.isRecruited).toBeTruthy();
        expect(seller.postId).toBeTruthy();
      });

      context('when appointment already exist at passed day ', () => {
        test('should return exception', () => {
          expect(() => {
            seller.addAppointment(floristPost.postId, day4);
          }).toThrowError();
        });
      });

      context('when appointment not exist at passed day ', () => {
        context('when passed postId is the same as appointed', () => {
          test('should return exception', () => {
            expect(() => {
              seller.addAppointment(floristPost.postId, day6);
            }).toThrowError();
          });
        });

        context('when passed postId is not the same as appointed', () => {
          context('when passed day is less than new recruit day', () => {
            test('should return exception', () => {
              expect(() => {
                seller.addAppointment(floristPost.postId, day5);
              }).toThrowError();
            });
          });

          context('when passed day is later than new recruit day', () => {
            test('should change postId', () => {
              seller.addAppointment(floristPost.postId);
              expect(seller.postId).toBe(floristPost.postId);
            });
          });
        });
      });
    });
  });

  describe('#updateAppointment', () => {
    context('when seller is not recruited', () => {
      beforeEach(() => {
        seller.updateAppointment(floristPost.postId, day2);

        expect(seller.isRecruitedAt(day1)).toBeFalsy();
        expect(seller.getRecruitDayAt(day1)).toBeUndefined();
        expect(seller.getPostIdAt(day1)).toBeUndefined();
        expect(seller.getPostIdsAt(day1)).toEqual([]);
        expect(seller.getPostIdsAt(day1)).toHaveLength(0);
        expect(seller.getAppointmentsAt(day1)).toEqual([]);
        expect(seller.getAppointmentsAt(day1)).toHaveLength(0);
        expect(seller.getSeniorityAt(day1)).toBeUndefined();
      });

      test('should recruit seller', () => {
        expect(seller.isRecruited).toBeTruthy();
      });

      test('should set recruit day', () => {
        expect(seller.recruitDay).toBe(day2);
      });

      test('should set postId', () => {
        expect(seller.postId).toBe(floristPost.postId);
      });

      test('should change appointments', () => {
        expect(seller.appointments).toEqual([
          { value: floristPost.postId, day: day2 },
        ]);
        expect(seller.appointments).toHaveLength(1);
      });

      test('should change postIds', () => {
        expect(seller.postIds).toEqual([floristPost.postId]);
        expect(seller.postIds).toHaveLength(1);
      });

      test('should start seniority', () => {
        expect(seller.seniority).not.toBeUndefined();
      });
    });

    context('when seller is recruited once', () => {
      beforeEach(() => {
        seller.setAppointments(appointmentsOfSeller);

        expect(seller.isRecruited).toBeTruthy();
        expect(seller.postId).toBeTruthy();
      });

      context('when appointment already exist at passed day ', () => {
        test('should return exception', () => {
          expect(() => {
            seller.updateAppointment(floristPost.postId, day4);
          }).toThrowError();
        });
      });

      context('when no appointment exist at passed day ', () => {
        context('when passed postId is the same as appointed', () => {
          test('should return exception', () => {
            expect(() => {
              seller.updateAppointment(floristPost.postId, day6);
            }).toThrowError();
          });
        });

        context('when passed postId is not the same as appointed', () => {
          test('should change postId', () => {
            seller.updateAppointment(floristPost.postId, day6);

            expect(seller.postId).toBe(floristPost.postId);
          });
        });
      });
    });

    context('when seller is dismissed', () => {
      beforeEach(() => {
        seller.setAppointments(appointmentsOfDismissedSeller);
        expect(seller.isRecruited).toBeFalsy();
        expect(seller.isDismissed).toBeTruthy();
        expect(seller.postId).toBeUndefined();
        expect(seller.dismissDay).toBeTruthy();

        seller.updateAppointment(floristPost.postId, day7);
      });

      test('should recruit seller', () => {
        expect(seller.isRecruited).toBeTruthy();
      });

      test('should set postId', () => {
        expect(seller.postId).toBe(floristPost.postId);
      });

      test('should make seller not dismissed', () => {
        expect(seller.isDismissed).toBeFalsy();
        expect(seller.dismissDay).toBeUndefined();
      });

      test('should change appointments', () => {
        expect(seller.appointments).toEqual([
          { value: floristPost.postId, day: day7 },
        ]);
        expect(seller.appointments).toHaveLength(1);
      });

      test('should change postIds', () => {
        expect(seller.postIds).toEqual([floristPost.postId]);
        expect(seller.postIds).toHaveLength(1);
      });

      test('should start seniority again', () => {
        expect(seller.seniority).not.toBeUndefined();
      });
    });

    context('when seller is recruited again', () => {
      beforeEach(() => {
        seller.setAppointments(appointmentsOfSellerRecruitedAgain);

        expect(seller.isRecruited).toBeTruthy();
        expect(seller.postId).toBeTruthy();
      });

      context('when appointment already exist at passed day ', () => {
        test('should return exception', () => {
          expect(() => {
            seller.updateAppointment(floristPost.postId, day4);
          }).toThrowError();
        });
      });

      context('when appointment not exist at passed day ', () => {
        context('when passed postId is the same as appointed', () => {
          test('should return exception', () => {
            expect(() => {
              seller.updateAppointment(floristPost.postId, day6);
            }).toThrowError();
          });
        });

        context('when passed postId is not the same as appointed', () => {
          context('when passed day is less than new recruit day', () => {
            test('should return exception', () => {
              expect(() => {
                seller.updateAppointment(floristPost.postId, day5);
              }).toThrowError();
            });
          });

          context('when passed day is later than new recruit day', () => {
            test('should change postId', () => {
              seller.updateAppointment(floristPost.postId);
              expect(seller.postId).toBe(floristPost.postId);
            });
          });
        });
      });
    });
  });

  describe('#deleteAppointment', () => {});

  describe('#dismiss', () => {
    context('when seller is not recruited', () => {
      beforeEach(() => {
        seller.dismiss(floristPost.postId, day2);

        expect(seller.isRecruitedAt(day1)).toBeFalsy();
        expect(seller.getRecruitDayAt(day1)).toBeUndefined();
        expect(seller.getPostIdAt(day1)).toBeUndefined();
        expect(seller.getPostIdsAt(day1)).toEqual([]);
        expect(seller.getPostIdsAt(day1)).toHaveLength(0);
        expect(seller.getAppointmentsAt(day1)).toEqual([]);
        expect(seller.getAppointmentsAt(day1)).toHaveLength(0);
        expect(seller.getSeniorityAt(day1)).toBeUndefined();
      });

      test('should return exception', () => {
        expect(seller.seniority).not.toBeUndefined();
      });
    });

    context('when seller is recruited once', () => {
      beforeEach(() => {
        seller.setAppointments(appointmentsOfSeller);

        expect(seller.isRecruited).toBeTruthy();
        expect(seller.postId).toBeTruthy();
      });

      context('when appointment already exist at passed day ', () => {
        test('should return exception', () => {
          expect(() => {
            seller.dismiss(floristPost.postId, day4);
          }).toThrowError();
        });
      });

      context('when no appointment exist at passed day ', () => {
        context('when passed postId is the same as appointed', () => {
          test('should return exception', () => {
            expect(() => {
              seller.dismiss(floristPost.postId, day6);
            }).toThrowError();
          });
        });

        context('when passed postId is not the same as appointed', () => {
          test('should change postId', () => {
            seller.dismiss(floristPost.postId, day6);

            expect(seller.postId).toBe(floristPost.postId);
          });
        });
      });
    });

    context('when seller is dismissed', () => {
      beforeEach(() => {
        seller.setAppointments(appointmentsOfDismissedSeller);
        expect(seller.isRecruited).toBeFalsy();
        expect(seller.isDismissed).toBeTruthy();
        expect(seller.postId).toBeUndefined();
        expect(seller.dismissDay).toBeTruthy();

        seller.dismiss(floristPost.postId, day7);
      });

      test('should recruit seller', () => {
        expect(seller.isRecruited).toBeTruthy();
      });

      test('should set postId', () => {
        expect(seller.postId).toBe(floristPost.postId);
      });

      test('should make seller not dismissed', () => {
        expect(seller.isDismissed).toBeFalsy();
        expect(seller.dismissDay).toBeUndefined();
      });

      test('should change appointments', () => {
        expect(seller.appointments).toEqual([
          { value: floristPost.postId, day: day7 },
        ]);
        expect(seller.appointments).toHaveLength(1);
      });

      test('should change postIds', () => {
        expect(seller.postIds).toEqual([floristPost.postId]);
        expect(seller.postIds).toHaveLength(1);
      });

      test('should start seniority again', () => {
        expect(seller.seniority).not.toBeUndefined();
      });
    });

    context('when seller is recruited again', () => {
      beforeEach(() => {
        seller.setAppointments(appointmentsOfSellerRecruitedAgain);

        expect(seller.isRecruited).toBeTruthy();
        expect(seller.postId).toBeTruthy();
      });

      context('when appointment already exist at passed day ', () => {
        test('should return exception', () => {
          expect(() => {
            seller.dismiss(floristPost.postId, day4);
          }).toThrowError();
        });
      });

      context('when appointment not exist at passed day ', () => {
        context('when passed postId is the same as appointed', () => {
          test('should return exception', () => {
            expect(() => {
              seller.dismiss(floristPost.postId, day6);
            }).toThrowError();
          });
        });

        context('when passed postId is not the same as appointed', () => {
          context('when passed day is less than new recruit day', () => {
            test('should return exception', () => {
              expect(() => {
                seller.dismiss(floristPost.postId, day5);
              }).toThrowError();
            });
          });

          context('when passed day is later than new recruit day', () => {
            test('should change postId', () => {
              seller.dismiss(floristPost.postId);
              expect(seller.postId).toBe(floristPost.postId);
            });
          });
        });
      });
    });
  });

  // describe('#setAppointments', () => {});
});
