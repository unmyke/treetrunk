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
const day1 = new Day({ value: new Date('2018.02.14 11:00') });
const day2 = new Day({ value: new Date('2018.03.20 11:00') });
const day3 = new Day({ value: new Date('2018.04.14 11:00') });
const day4 = new Day({ value: new Date('2018.04.16 11:00') });
const day5 = new Day({ value: new Date('2018.04.18 11:00') });
const day6 = new Day({ value: new Date('2018.05.01 11:00') });

const quitPostId = new PostId();
PostId.quitPostId = quitPostId;

describe('Domain :: entities :: Seller', () => {
  let seller;
  beforeEach(() => {
    seller = new Seller({ lastName, firstName, middleName, phone });
  });

  describe('#getRecruitDayAt', () => {
    context('when seller have no appointments', () => {
      test('should return undefined', () => {
        expect(seller.getRecruitDayAt()).toBeUndefined();
      });
    });

    context('when seller have no appointments at that time', () => {
      test('should return undefined', () => {
        seller.addAppointment(seniorFloristPost.postId, day2);
        expect(seller.getRecruitDayAt(day1)).toBeUndefined();
      });
    });

    context('when seller have appointments without quit', () => {
      beforeEach(() => {
        seller.addAppointment(floristPost.postId, day2);
        seller.addAppointment(seniorFloristPost.postId, day1);
      });

      test('should return first appointment day at any time', () => {
        expect(seller.getRecruitDayAt()).toBe(day1);
        expect(seller.getRecruitDayAt(day2)).toBe(day1);
      });

      test('should return first appointment day after another appointment', () => {
        seller.addAppointment(seniorFloristPost.postId, day4);
        seller.addAppointment(floristPost.postId, day3);
        expect(seller.getRecruitDayAt()).toBe(day1);
      });
    });

    context('when seller have appointments with quit', () => {
      beforeEach(() => {
        seller.addAppointment(floristPost.postId, day1);
        seller.addAppointment(quitPostId, day2);
        seller.addAppointment(floristPost.postId, day3);
        seller.addAppointment(seniorFloristPost.postId, day4);
        seller.addAppointment(quitPostId, day5);
      });

      test('should return first appointment day after last quit', () => {
        expect(seller.getRecruitDayAt()).toBe(day1);
      });

      test('should return first appointment day after another appointment', () => {
        expect(seller.getRecruitDayAt()).toBe(day1);
      });
    });
  });

  describe('#addAppointment', () => {
    context('when seller have no appointments', () => {
      test('should return undefined', () => {
        expect(seller.getAppointmentsAt()).toEqual([]);
        expect(seller.getAppointmentsAt().length).toBe(0);
      });
    });

    context('when seller have appointments', () => {
      beforeEach(() => {
        seller.addAppointment(floristPost.postId, day1);
      });

      test('should return ', () => {
        expect(seller.getRecruitDayAt()).toBe(day1);
        seller.addAppointment(quitPostId, day2);
        seller.addAppointment(floristPost.postId, day3);
        seller.addAppointment(quitPostId, day4);
        // console.log(seller.appointments);
        //expect(seller.quitDay).toEqual(newDay);
        // expect(seller.getAppointmentsAt()).toHaveLength(4);
        expect(
          seller._getPostIdAppointmentsAt(newDay, floristPost.postId)
        ).toHaveLength(2);
        expect(
          seller._getPostIdAppointmentsAt(newDay, quitPostId)
        ).toHaveLength(2);
        // expect(seller.);
      });
    });
  });
});
