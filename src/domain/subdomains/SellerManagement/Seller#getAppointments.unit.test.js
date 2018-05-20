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
const day1 = new Day({ value: new Date('2017.02.14 11:00') });
const day2 = new Day({ value: new Date('2017.03.20 11:00') });
const day3 = new Day({ value: new Date('2017.04.14 11:00') });
const day4 = new Day({ value: new Date('2017.04.16 11:00') });
const day5 = new Day({ value: new Date('2017.04.18 11:00') });
const day6 = new Day({ value: new Date('2017.05.01 11:00') });
const day7 = new Day({ value: new Date('2017.06.01 11:00') });
const day8 = new Day({ value: new Date('2017.07.01 11:00') });

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

    context('when seller have only appointments without quit', () => {
      beforeEach(() => {
        seller.addAppointment(floristPost.postId, day2);
        seller.addAppointment(seniorFloristPost.postId, day3);
      });

      context('when passed day before first appointment', () => {
        test('should return undefined', () => {
          expect(seller.getRecruitDayAt(day1)).toBeUndefined();
        });
      });

      context('when passed day of first appointment', () => {
        test('should return first appointment', () => {
          expect(seller.getRecruitDayAt(day2)).toBe(day2);
        });
      });
      context('when passed day after first appointment', () => {
        test('should return first appointment', () => {
          expect(seller.getRecruitDayAt()).toBe(day2);
        });
      });
    });

    context('when seller have appointments with quit', () => {
      beforeEach(() => {
        seller.addAppointment(floristPost.postId, day2);
        seller.addAppointment(seniorFloristPost.postId, day3);
        seller.addAppointment(quitPostId, day4);
      });

      context('when seller recruited once', () => {
        context('when passed day before first appointment', () => {
          test('should return undefined', () => {
            expect(seller.getRecruitDayAt(day1)).toBeUndefined();
          });
        });

        context('when passed day of first appointment', () => {
          test('should return first appointment', () => {
            expect(seller.getRecruitDayAt(day2)).toBe(day2);
          });
        });

        context(
          'when passed day after first appointment and before last appointment ',
          () => {
            test('should return first appointment', () => {
              expect(seller.getRecruitDayAt(day3)).toBe(day2);
            });
          }
        );

        context('when passed day of last appointment ', () => {
          test('should return undefined', () => {
            expect(seller.getRecruitDayAt(day4)).toBeUndefined();
          });
        });

        context('when passed day after last appointment ', () => {
          test('should return undefined', () => {
            expect(seller.getRecruitDayAt(day5)).toBeUndefined();
          });
        });
      });

      context('when seller recruited more than once', () => {
        beforeEach(() => {
          seller.addAppointment(floristPost.postId, day6);
          seller.addAppointment(quitPostId, day8);
        });

        context('when passed day before first appointment', () => {
          test('should return undefined', () => {
            expect(seller.getRecruitDayAt(day1)).toBeUndefined();
          });
        });

        context('when passed day of first appointment', () => {
          test('should return first appointment', () => {
            expect(seller.getRecruitDayAt(day2)).toBe(day2);
          });
        });

        context(
          'when passed day after first appointment and before last appointment ',
          () => {
            test('should return first appointment', () => {
              expect(seller.getRecruitDayAt(day3)).toBe(day2);
            });
          }
        );

        context('when passed day of last appointment ', () => {
          test('should return undefined', () => {
            expect(seller.getRecruitDayAt(day4)).toBeUndefined();
          });
        });

        context('when passed day between quit and new recruit day', () => {
          test('should return undefined', () => {
            expect(seller.getRecruitDayAt(day5)).toBeUndefined();
          });
        });

        context('when passed day of new recruit', () => {
          test('should not return previous recruit day', () => {
            expect(seller.getRecruitDayAt(day6)).toBe(day6);
          });
        });

        context('when passed day after new recruit', () => {
          test('should not return previous recruit day', () => {
            expect(seller.getRecruitDayAt(day7)).toBe(day6);
          });
        });

        context('when passed last quit day', () => {
          test('should return undefined', () => {
            expect(seller.getRecruitDayAt(day8)).toBeUndefined();
          });
        });

        context('when passed after last quit day', () => {
          test('should return undefined', () => {
            expect(seller.getRecruitDayAt()).toBeUndefined();
          });
        });
      });
    });
  });

  // describe('#addAppointment', () => {
  //   context('when seller have no appointments', () => {
  //     test('should return undefined', () => {
  //       expect(seller.getAppointmentsAt()).toEqual([]);
  //       expect(seller.getAppointmentsAt().length).toBe(0);
  //     });
  //   });

  //   context('when seller have appointments', () => {
  //     beforeEach(() => {
  //       seller.addAppointment(floristPost.postId, day1);
  //     });

  //     test('should return ', () => {
  //       expect(seller.getRecruitDayAt()).toBe(day1);
  //       seller.addAppointment(quitPostId, day2);
  //       seller.addAppointment(floristPost.postId, day3);
  //       seller.addAppointment(quitPostId, day4);
  //       // console.log(seller.appointments);
  //       //expect(seller.quitDay).toEqual(newDay);
  //       // expect(seller.getAppointmentsAt()).toHaveLength(4);
  //       expect(
  //         seller._getPostIdAppointmentsAt(newDay, floristPost.postId)
  //       ).toHaveLength(2);
  //       expect(
  //         seller._getPostIdAppointmentsAt(newDay, quitPostId)
  //       ).toHaveLength(2);
  //       // expect(seller.);
  //     });
  //   });
  // });
});
