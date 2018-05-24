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

  describe('#getAppointmentsAt', () => {
    context('when seller have no appointments', () => {
      test('should return empty array at any time', () => {
        expect(seller.getAppointmentsAt(day1)).toEqual([]);
        expect(seller.getAppointmentsAt(day5)).toEqual([]);
      });
    });

    context('when seller have appointments', () => {
      context('withoit quit', () => {
        let appointments;
        beforeEach(() => {
          appointments = [
            { postId: floristPost.postId, day: day2 },
            { postId: seniorFloristPost.postId, day: day4 },
          ];
          seller.setAppointments(appointments);
        });
        context('when passed day is before first appointment', () => {
          test('should return empty array', () => {
            expect(seller.getAppointmentsAt(day1)).toEqual([]);
          });
        });

        context('when passed day is appointment day', () => {
          test('should return array containing appointment', () => {
            // expect(seller.getAppointmentsAt(day2)).toContainEqual({
            //   postId: floristPost.postId,
            //   day: day2,
            // });
            expect(seller.getAppointmentsAt(day2)).toEqual([
              {
                postId: floristPost.postId,
                day: day2,
              },
            ]);
          });
        });

        context('when passed day is between appointments', () => {
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

        context('when passed day is any day after last appointment', () => {
          test('should return same array at any day', () => {
            expect(seller.getAppointmentsAt(day5)).toEqual(appointments);
            expect(seller.getAppointmentsAt(day9)).toEqual(appointments);
          });
        });
      });
    });

    context('with quit', () => {
      beforeEach(() => {
        const appointments = [
          { postId: floristPost.postId, day: day2 },
          { postId: quitPostId, day: day3 },
          { postId: floristPost.postId, day: day5 },
        ];
        seller.setAppointments(appointments);
      });

      context('when passed day is between quit and new recruit', () => {
        // test('should return array with only appointments before recruit', () => {
        //   expect(seller.getAppointmentsAt(day4)).toEqual([
        //     { postId: floristPost.postId, day: day2 },
        //   ]);
        // });
        test('should return empty array', () => {
          expect(seller.getAppointmentsAt(day4)).toEqual([]);
        });

        test('should return array not containing appointments after new recruit ', () => {
          expect(seller.getAppointmentsAt(day4)).not.toContainEqual([
            { postId: floristPost.postId, day: day5 },
          ]);
        });
      });

      context('when passed day is quit day', () => {
        // test('should return array containing quit appointment', () => {
        //   expect(seller.getAppointmentsAt(day3)).toContainEqual({
        //     postId: quitPostId,
        //     day: day3,
        //   });
        // });
        test('should return empty array', () => {
          expect(seller.getAppointmentsAt(day3)).toEqual([]);
        });
      });

      context('when passed day is after new recruit', () => {
        test('should return array with only appointments after new recruit', () => {
          expect(seller.getAppointmentsAt(day6)).toEqual([
            {
              postId: floristPost.postId,
              day: day5,
            },
          ]);
        });
        test('should return array not containing appointments before new recruit ', () => {
          expect(seller.getAppointmentsAt(day6)).not.toContainEqual([
            { postId: floristPost.postId, day: day2 },
          ]);
        });
      });
    });

    context('when passed no day as argument', () => {
      beforeEach(() => {
        const appointments = [{ postId: floristPost.postId, day: day2 }];
        seller.setAppointments(appointments);
      });
      test('should return updated array after new appointment', () => {
        expect(seller.getAppointmentsAt()).toEqual([
          { postId: floristPost.postId, day: day2 },
        ]);
        expect(seller.getAppointmentsAt()).toHaveLength(1);

        seller.addAppointment(seniorFloristPost.postId, day3);

        expect(seller.getAppointmentsAt()).toContainEqual([
          { postId: seniorFloristPost.postId, day: day3 },
        ]);
        expect(seller.getAppointmentsAt()).toHaveLength(2);
      });
    });
  });

  describe('#appointments', () => {
    context('when seller have no appointments now', () => {
      test('should return empty array', () => {
        expect(seller.appointments).toEqual([]);
      });
    });

    context('when seller appoint to post', () => {
      test('should return updated array', () => {
        seller.addAppointment(floristPost.postId, day2);

        expect(seller.appointments).toEqual([
          { postId: floristPost.postId, day: day2 },
        ]);
      });
    });
  });

  describe('#getPostIdAt', () => {
    beforeEach(() => {
      const appointments = [
        { postId: floristPost.postId, day: day2 },
        { postId: quitPostId, day: day4 },
      ];
      seller.setAppointments(appointments);
    });

    context('when passed day is before first appointment', () => {
      test('should return undefined', () => {
        expect(seller.getPostIdAt(day1)).toBeUndefined();
      });
    });

    context('when passed day is appointment day', () => {
      test('should return updated postId', () => {
        expect(seller.getPostIdAt(day2)).toBe(floristPost.postId);
      });
    });

    context('when passed day is between appointments', () => {
      test('should return postId of previous appointment', () => {
        expect(seller.getPostIdAt(day3)).toBe(floristPost.postId);
      });
    });

    context('when passed day is any day after last appointment', () => {
      test('should return same postId at any time', () => {
        expect(seller.getPostIdAt(day6)).toBe(quitPostId);
        expect(seller.getPostIdAt(day8)).toBe(quitPostId);
      });
    });

    context('when passed no day as argument', () => {
      test('should return postId of last appointment', () => {
        expect(seller.getPostIdAt()).toBe(quitPostId);
        expect(seller.getPostIdAt()).toBe(quitPostId);
      });
    });
  });

  describe('#postId', () => {
    context('when seller have no appointments now', () => {
      test('should return undefined', () => {
        expect(seller.postId).toBeUndefined();
      });
    });

    context('when seller appoint to post', () => {
      test('should return updated postId', () => {
        seller.addAppointment(floristPost.postId);

        expect(seller.postId).toEqual(floristPost.postId);
      });
    });
  });

  describe('#getPostIdsAt', () => {
    beforeEach(() => {
      seller.setAppointments([
        { postId: floristPost.postId, day: day2 },
        { postId: quitPostId, day: day4 },
      ]);
    });

    context('when passed day before first appointment', () => {
      test('should return undefined', () => {
        expect(seller.getPostIdAt(day1)).toBeUndefined();
      });
    });
  });

  describe('#postIds', () => {
    context('when seller have no appointments now', () => {
      test('should return empty array', () => {
        expect(seller.postIds).toEqual([]);
      });
    });

    context('when seller appoint to post', () => {
      test('should return updated array', () => {
        seller.addAppointment(floristPost.postId);

        expect(seller.postIds).toContain(floristPost.postId);
      });
    });
  });

  describe('#getRecruitDayAt', () => {
    context('when seller have no appointments', () => {
      test('should return undefined', () => {
        expect(seller.getRecruitDayAt()).toBeUndefined();
      });
    });

    context('when seller have appointments', () => {
      context('without quit', () => {
        beforeEach(() => {
          const appointments = [
            { postId: floristPost.postId, day: day2 },
            { postId: seniorFloristPost.postId, day: day4 },
          ];
          seller.setAppointments(appointments);
        });
        context('when passed day is before first appointment', () => {
          test('should return undefined', () => {
            expect(seller.getRecruitDayAt(day1)).toBeUndefined();
          });
        });

        context('when passed day is recruit day', () => {
          test('should return recruit day', () => {
            expect(seller.getRecruitDayAt(day2)).toBe(day2);
          });
        });
        context('when passed day is between appointments', () => {
          test('should return first appointment day at', () => {
            expect(seller.getRecruitDayAt(day3)).toBe(day2);
          });
        });
      });

      context('with quit', () => {
        beforeEach(() => {
          const appointments = [
            { postId: floristPost.postId, day: day2 },
            { postId: seniorFloristPost.postId, day: day3 },
            { postId: quitPostId, day: day4 },
          ];
          seller.setAppointments(appointments);
        });
        //////////////////////////////////////////////
      });
    });
  });

  describe('#recruitDay', () => {
    context('when seller have no appointments now', () => {
      test('should return undefined', () => {
        expect(seller.recruitDay).toBeUndefined();
      });
    });

    context('when seller appoint to post', () => {
      test('should return only day of first appointment ', () => {
        seller.addAppointment(floristPost.postId, day2);
        expect(seller.recruitDay).toBe(day2);

        seller.addAppointment(floristPost.postId);
        expect(seller.recruitDay).toBe(day2);
      });
    });
  });

  describe('#isRecruitedAt', () => {
    context('when seller have no appointments', () => {
      test('should return false at any time', () => {
        expect(seller.isRecruitedAt(day2)).toBe(false);
        expect(seller.isRecruitedAt(day5)).toBe(false);
      });
    });
    context('when seller have appointments', () => {
      context('when seller have no appointments', () => {
        test('should be undefined', () => {
          expect(seller.isRecruitedAt()).toBe(false);
        });
      });
    });
  });

  describe('#isRecruited', () => {
    context('when seller have no appointments now', () => {
      test('should return undefined', () => {
        expect(seller.isRecruited).toBe(false);
      });
    });

    context('when seller appoint to post', () => {
      test('should return true', () => {
        seller.addAppointment(floristPost.postId);

        expect(seller.isRecruited).toBe(true);
      });
    });
  });

  describe('#getQuitDayAt', () => {
    context('when seller have no appointments', () => {
      test('should return undefined', () => {
        expect(seller.getQuitDayAt(day2)).toBeUndefined();
      });
    });

    context('when seller have appointments', () => {
      context('without quit', () => {
        beforeEach(() => {
          const appointments = [
            { postId: floristPost.postId, day: day2 },
            { postId: seniorFloristPost.postId, day: day4 },
          ];
          seller.setAppointments(appointments);
        });
        context('when passed day is between appointments', () => {
          test('should return undefined', () => {
            expect(seller.getQuitDayAt(day3)).toBeUndefined();
          });
        });
      });

      context('with quit', () => {
        beforeEach(() => {
          const appointments = [
            { postId: floristPost.postId, day: day2 },
            { postId: quitPostId, day: day3 },
            { postId: floristPost.postId, day: day5 },
          ];
          seller.setAppointments(appointments);
        });

        context('when passed day is when seller take quit', () => {
          test('should return this day', () => {
            expect(seller.getQuitDayAt(day3)).toBe(day3);
          });
        });

        context('when passed day is between quit and new recruit', () => {
          test('should return day is when seller take quit', () => {
            expect(seller.getQuitDayAt(day4)).toBe(day3);
          });
        });
      });
    });
  });

  describe('#quitDay', () => {
    context('when seller have no appointments now', () => {
      test('should return undefined', () => {
        expect(seller.quitDay).toBeUndefined();
      });
    });

    context('when seller take quit', () => {
      test('should return day when quit take place', () => {
        seller.addAppointment(quitPostId, day2);
        //seller.takeQuit(day2);
        expect(seller.quitDay).toBe(day2);
      });
    });
  });

  describe('#isQuitedAt', () => {});

  describe('#isQuited', () => {
    context('when seller have no appointments now', () => {
      test('should return false', () => {
        expect(seller.isQuited).toBe(false);
      });
    });

    context('when seller take quit', () => {
      test('should return true', () => {
        seller.addAppointment(floristPost.postId, day2);
        seller.addAppointment(quitPostId);
        //seller.takeQuit();
        expect(seller.isQuited).toBe(true);
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

  describe('#seniority', () => {
    context('when seller have no appointments now', () => {
      test('should return 0', () => {
        expect(seller.seniority).toBe(0);
      });
    });

    context('when seller appoint to post time ago', () => {
      test('should be not 0', () => {
        seller.addAppointment(floristPost.postId, day2);

        expect(seller.seniority).toBe(true);
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
