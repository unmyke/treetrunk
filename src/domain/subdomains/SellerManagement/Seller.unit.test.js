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
  beforeEach(() => {
    seller = new Seller({ lastName, firstName, middleName, phone });
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
        expect(seller.seniorityAt(day1)).not.toBeUndefined();
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

  describe('#getPostIdAt', () => {
    beforeEach(() => {
      seller.setAppointments([
        { postId: floristPost.postId, date: day2.value },
        { postId: quitPostId, date: day4.value },
      ]);
    });

    context('when passed day before first appointment', () => {
      test('should return undefined', () => {
        expect(seller.getPostIdAt(day1)).toBeUndefined();
      });
    });

    context('when passed day of appointment', () => {
      test('should return updated postId', () => {
        expect(seller.getPostIdAt(day2)).toBe(floristPost.postId);
      });
    });

    context('when passed day is between 2 appointments', () => {
      test('should return postId of first appointment', () => {
        expect(seller.getPostIdAt(day3)).toBe(floristPost.postId);
      });
    });
  });

  describe('#seniorityAt', () => {
    context('when seller have appointments', () => {
      beforeEach(() => {
        seller.addAppointment(floristPost.postId, day2);
        seller.addAppointment(seniorFloristPost.postId, day3);
      });

      test('should be an integer', () => {
        expect(seller.seniorityAt(day3)).toBe(0);
      });

      test("should be undefined when passed before seller's appointment", () => {
        expect(seller.seniorityAt(day1)).toBeUndefined();
      });
    });

    context('when seller was quited', () => {
      beforeEach(() => {
        seller.addAppointment(floristPost.postId, day1);
        seller.addAppointment(seniorFloristPost.postId, day2);
        seller.takeQuit(day3);
      });

      test('should be undefined at today', () => {
        expect(seller.seniorityAt()).toBeUndefined();
      });

      test('should be a integer at day before quit', () => {
        expect(seller.seniorityAt(day3.prev())).toBe(1);
      });
    });

    context('when seller have no appointments', () => {
      test('should be undefined', () => {
        expect(seller.seniorityAt()).toBeUndefined();
      });
    });
  });

  describe('#isRecruitedAt', () => {
    test('should be undefined', () => {
      expect(seller.isRecruitedAt()).toBe(false);
    });
  });

  describe('#postIds', () => {
    context('when seller have appointments', () => {
      test('should return array of postIds', () => {
        seller.addAppointment(floristPost.postId, day3);
        seller.addAppointment(floristPost.postId, day1);
        seller.addAppointment(seniorFloristPost.postId, day2);

        expect(seller.postIds).toEqual([
          floristPost.postId,
          seniorFloristPost.postId,
        ]);
      });
    });

    context('when seller have no appointments', () => {
      test('should return empty array', () => {
        expect(seller.postIds).toEqual([]);
      });
    });
  });

  describe('#getQuitDayAt', () => {
    context('when seller have appointments', () => {
      beforeEach(() => {
        seller.addAppointment(floristPost.postId, day1);
        seller.takeQuit(day2);
        seller.addAppointment(floristPost.postId, day3);
        seller.addAppointment(seniorFloristPost.postId, day4);
        seller.takeQuit(day5);
        seller.addAppointment(floristPost.postId, day6);
        seller.takeQuit(day7);
        seller.addAppointment(floristPost.postId, day8);
        seller.addAppointment(seniorFloristPost.postId, day9);
        seller.takeQuit(day10);
      });

      test('should return undefined at 15.12.2016', () => {
        const day = new Day({ value: new Date('2016.12.15') });

        expect(seller.getQuitDayAt(day)).toBeUndefined();
      });

      test('should return undefined at 15.01.2017', () => {
        const day = new Day({ value: new Date('2017.01.15') });

        expect(seller.getQuitDayAt(day)).toBeUndefined();
      });

      test('should return quit day at 15.02.2017', () => {
        const day = new Day({ value: new Date('2017.02.15') });

        expect(seller.getQuitDayAt(day).equals(day2)).toBeTruthy();
      });

      test('should return undefined at 15.03.2017', () => {
        const day = new Day({ value: new Date('2017.03.15') });

        expect(seller.getQuitDayAt(day)).toBeUndefined();
      });

      test('should return undefined at 15.04.2017', () => {
        const day = new Day({ value: new Date('2017.04.15') });

        expect(seller.getQuitDayAt(day)).toBeUndefined();
      });

      test('should return quit day at 15.05.2017', () => {
        const day = new Day({ value: new Date('2017.05.15') });

        expect(seller.getQuitDayAt(day).equals(day5)).toBeTruthy();
      });

      test('should return undefined at 15.06.2017', () => {
        const day = new Day({ value: new Date('2017.06.15') });

        expect(seller.getQuitDayAt(day)).toBeUndefined();
      });

      test('should return quit day at 15.07.2017', () => {
        const day = new Day({ value: new Date('2017.07.15') });

        expect(seller.getQuitDayAt(day).equals(day7)).toBeTruthy();
      });

      test('should return undefined at 15.08.2017', () => {
        const day = new Day({ value: new Date('2017.08.15') });

        expect(seller.getQuitDayAt(day)).toBeUndefined();
      });

      test('should return undefined at 15.09.2017', () => {
        const day = new Day({ value: new Date('2017.09.15') });

        expect(seller.getQuitDayAt(day)).toBeUndefined();
      });

      test('should return quit day at 15.10.2017', () => {
        const day = new Day({ value: new Date('2017.10.15') });

        expect(seller.getQuitDayAt(day).equals(day10)).toBeTruthy();
      });
    });

    context('when seller have no appointments', () => {
      test('should return undefined', () => {
        expect(seller.getQuitDayAt()).toBeUndefined();
      });
    });
  });

  describe('#getRecruitDayAt', () => {
    context('when seller have appointments', () => {
      beforeEach(() => {
        seller.addAppointment(floristPost.postId, day1);
        seller.takeQuit(day2);
        seller.addAppointment(floristPost.postId, day3);
        seller.addAppointment(seniorFloristPost.postId, day4);
        seller.takeQuit(day5);
        seller.addAppointment(floristPost.postId, day6);
        seller.takeQuit(day7);
        seller.addAppointment(floristPost.postId, day8);
        seller.addAppointment(seniorFloristPost.postId, day9);
        seller.takeQuit(day10);
      });

      test('should return undefined at 15.12.2016', () => {
        const day = new Day({ value: new Date('2016.12.15') });

        expect(seller.getRecruitDayAt(day)).toBeUndefined();
      });

      test('should return recruit day at 15.01.2017', () => {
        const day = new Day({ value: new Date('2017.01.15') });

        expect(seller.getRecruitDayAt(day).equals(day1)).toBeTruthy();
      });

      test('should return undefined at 15.02.2017', () => {
        const day = new Day({ value: new Date('2017.02.15') });

        expect(seller.getRecruitDayAt(day)).toBeUndefined();
      });

      test('should return recruit day at 15.03.2017', () => {
        const day = new Day({ value: new Date('2017.03.15') });

        expect(seller.getRecruitDayAt(day).equals(day3)).toBeTruthy();
      });

      test('should return recruit day at 15.04.2017', () => {
        const day = new Day({ value: new Date('2017.04.15') });

        expect(seller.getRecruitDayAt(day).equals(day3)).toBeTruthy();
      });

      test('should return undefined at 15.05.2017', () => {
        const day = new Day({ value: new Date('2017.05.15') });

        expect(seller.getRecruitDayAt(day)).toBeUndefined();
      });

      test('should return recruit day at 15.06.2017', () => {
        const day = new Day({ value: new Date('2017.06.15') });

        expect(seller.getRecruitDayAt(day).equals(day6)).toBeTruthy();
      });

      test('should return undefined at 15.07.2017', () => {
        const day = new Day({ value: new Date('2017.07.15') });

        expect(seller.getRecruitDayAt(day)).toBeUndefined();
      });

      test('should return recruit day at 15.08.2017', () => {
        const day = new Day({ value: new Date('2017.08.15') });

        expect(seller.getRecruitDayAt(day).equals(day8)).toBeTruthy();
      });

      test('should return recruit day at 15.09.2017', () => {
        const day = new Day({ value: new Date('2017.09.15') });

        expect(seller.getRecruitDayAt(day).equals(day8)).toBeTruthy();
      });

      test('should return undefined at 15.10.2017', () => {
        const day = new Day({ value: new Date('2017.10.15') });

        expect(seller.getRecruitDayAt(day)).toBeUndefined();
      });
    });

    context('when seller have no appointments', () => {
      test('should return undefined', () => {
        expect(seller.getRecruitDayAt()).toBeUndefined();
      });
    });
  });

  describe('#getAppointmentsAt', () => {
    context('when seller have appointments', () => {
      beforeEach(() => {
        seller.addAppointment(floristPost.postId, day1);
        seller.takeQuit(day2);
        seller.addAppointment(floristPost.postId, day3);
        seller.addAppointment(seniorFloristPost.postId, day4);
        seller.takeQuit(day5);
        seller.addAppointment(floristPost.postId, day6);
        seller.takeQuit(day7);
        seller.addAppointment(floristPost.postId, day8);
        seller.addAppointment(seniorFloristPost.postId, day9);
        seller.takeQuit(day10);
      });

      test('should return an array with one appointment at 15.01.2017', () => {
        const day = new Day({ value: new Date('2017.01.15') });

        const appointments = seller.getAppointmentsAt(day);
        expect(appointments).toHaveLength(1);
        expect(seller.getAppointmentsAt().length).toBe(0);
        expect(appointments[0].postId).toBe(floristPost.postId);
        expect(appointments[0].day).toBe(day1);
      });

      test('should return an empty array at 15.02.2017', () => {
        const day = new Day({ value: new Date('2017.02.15') });

        const appointments = seller.getAppointmentsAt(day);
        expect(appointments).toHaveLength(0);
      });

      test('should return an array with one appointment at 15.03.2017', () => {
        const day = new Day({ value: new Date('2017.03.15') });

        const appointments = seller.getAppointmentsAt(day);
        expect(appointments).toHaveLength(1);
        expect(appointments[0].postId).toBe(floristPost.postId);
        expect(appointments[0].day).toBe(day3);
      });

      test('should return an array with two appointment at 15.04.2017', () => {
        const day = new Day({ value: new Date('2017.04.15') });

        const appointments = seller.getAppointmentsAt(day);
        expect(appointments).toHaveLength(2);
        expect(appointments[0].postId).toBe(floristPost.postId);
        expect(appointments[0].day).toBe(day3);
        expect(appointments[1].postId).toBe(seniorFloristPost.postId);
        expect(appointments[1].day).toBe(day4);
      });

      test('should return an empty array at 15.05.2017', () => {
        const day = new Day({ value: new Date('2017.05.15') });

        const appointments = seller.getAppointmentsAt(day);
        expect(appointments).toHaveLength(0);
      });

      test('should return an array with one appointment at 15.06.2017', () => {
        const day = new Day({ value: new Date('2017.06.15') });

        const appointments = seller.getAppointmentsAt(day);
        expect(appointments).toHaveLength(1);
        expect(appointments[0].postId).toBe(floristPost.postId);
        expect(appointments[0].day).toBe(day6);
      });

      test('should return an empty array at 15.07.2017', () => {
        const day = new Day({ value: new Date('2017.07.15') });

        const appointments = seller.getAppointmentsAt(day);
        expect(appointments).toHaveLength(0);
      });

      test('should return an array with one appointment at 15.08.2017', () => {
        const day = new Day({ value: new Date('2017.08.15') });

        const appointments = seller.getAppointmentsAt(day);
        expect(appointments).toHaveLength(1);
        expect(appointments[0].postId).toBe(floristPost.postId);
        expect(appointments[0].day).toBe(day8);
      });

      test('should return an array with two appointment at 15.09.2017', () => {
        const day = new Day({ value: new Date('2017.09.15') });

        const appointments = seller.getAppointmentsAt(day);
        expect(appointments).toHaveLength(2);
        expect(appointments[0].postId).toBe(floristPost.postId);
        expect(appointments[0].day).toBe(day8);
        expect(appointments[1].postId).toBe(seniorFloristPost.postId);
        expect(appointments[1].day).toBe(day9);
      });

      test('should return an empty array at 15.10.2017', () => {
        const day = new Day({ value: new Date('2017.10.15') });

        const appointments = seller.getAppointmentsAt(day);
        expect(appointments).toHaveLength(0);
      });
    });
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

  describe('#get/_get', () => {
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
        seller.takeQuit(newDay);

        expect(seller.quitDay).toEqual(newDay);
        expect(seller._getPostIdAppointmentsAt(day, quitPostId)).toHaveLength(
          1
        );
      });
    });
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
});
