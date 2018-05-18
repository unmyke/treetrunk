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
const appointmentDay1 = new Day({ value: new Date('2018.02.14 11:00') });
const appointmentDay2 = new Day({ value: new Date('2018.03.20 11:00') });
const appointmentDay3 = new Day({ value: new Date('2018.04.14 11:00') });
const appointmentDay4 = new Day({ value: new Date('2018.04.16 11:00') });
const appointmentDay5 = new Day({ value: new Date('2018.04.18 11:00') });
const appointmentDay6 = new Day({ value: new Date('2018.05.01 11:00') });

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
    test('should have set points', () => {
      expect(seller.appointments).toHaveLength(0);
      expect(seller.seniorityAt(appointmentDay1)).toBeUndefined();
      expect(seller.isRecruitedAt()).toBe(false);
      expect(seller.recruitDay).toBeUndefined();
    });
  });

  describe('#addAppointment', () => {
    beforeEach(() => {
      seller.addAppointment(floristPost.postId, appointmentDay1);
    });

    context('when seller appointed to postId', () => {
      test('should recruit seller', () => {
        expect(seller.isRecruitedAt()).toBe(true);
        expect(seller.recruitDay).toBe(appointmentDay1);
      });

      test('should return seniority not undefined', () => {
        expect(seller.seniorityAt(appointmentDay1)).not.toBeUndefined();
      });

      test('should have appointments length equal to 1', () => {
        expect(seller.appointments).toHaveLength(1);
      });
    });

    // context('when appoint to same postId at same date', () => {
    //   test('should throw exeption', () => {
    //     try {
    //       seller.addAppointment(floristPost.postId, appointmentDay1);
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
      seller.addAppointment(floristPost.postId, appointmentDay1);
      seller.addAppointment(seniorFloristPost.postId, appointmentDay2);
      seller.addAppointment(floristPost.postId, appointmentDay3);
    });

    context('when delete existing appointment', () => {
      test('should decrease appointments length', () => {
        expect(seller.appointments).toHaveLength(3);

        seller.deleteAppointment(floristPost.postId, appointmentDay3);

        expect(seller.getPostIdAt()).toBe(seniorFloristPost.postId);
        expect(seller.appointments).toHaveLength(2);
      });
    });

    // context('when delete appointment twice', () => {
    //   test('should throw exeption', () => {
    //     seller.deleteAppointment(floristPost.postId, appointmentDay3);

    //     try {
    //       seller.deleteAppointment(floristPost.postId, appointmentDay3);
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
      seller.addAppointment(floristPost.postId, appointmentDay1);
    });

    context('when appointment has created with wrong postId', () => {
      test('should change associated postId', () => {
        seller.editAppointment(
          floristPost.postId,
          appointmentDay1,
          seniorFloristPost.postId,
          appointmentDay1
        );

        expect(seller.appointments).toHaveLength(1);
        expect(seller.appointments[0].day).toEqual(appointmentDay1);
        expect(seller.getPostIdAt()).toBe(seniorFloristPost.postId);
      });
    });

    context('when appointment has created with wrong date', () => {
      test('should change associated date', () => {
        seller.editAppointment(
          floristPost.postId,
          appointmentDay1,
          floristPost.postId,
          appointmentDay2
        );
        expect(seller.appointments).toHaveLength(1);
        expect(seller.getPostIdAt(appointmentDay1)).toEqual(undefined);
        expect(seller.getPostIdAt(appointmentDay2)).toBe(floristPost.postId);
      });
    });
  });

  describe('#getPostIdAt', () => {
    beforeEach(() => {
      seller.addAppointment(seniorFloristPost.postId, appointmentDay2);
      seller.addAppointment(floristPost.postId, appointmentDay3);
      seller.addAppointment(floristPost.postId, appointmentDay1);
    });

    context('when requested before first appointment', () => {
      test('should return postId undefined', () => {
        expect(seller.getPostIdAt(appointmentDay1.subDays(1))).toBeUndefined();
      });
    });

    context('when requested past postId', () => {
      test('should return postId appointed at that day', () => {
        expect(seller.getPostIdAt(appointmentDay2)).toBe(
          seniorFloristPost.postId
        );
      });
    });

    context('when requested current postId associated with seller', () => {
      test('should return last postId', () => {
        expect(seller.getPostIdAt(newDay)).toBe(floristPost.postId);
      });
    });
  });

  describe('#seniorityAt', () => {
    context('when seller have appointments', () => {
      beforeEach(() => {
        seller.addAppointment(floristPost.postId, appointmentDay2);
        seller.addAppointment(seniorFloristPost.postId, appointmentDay3);
      });

      test('should be an integer', () => {
        expect(seller.seniorityAt(appointmentDay3)).toBe(0);
      });

      test("should be undefined when requested before seller's appointment", () => {
        expect(seller.seniorityAt(appointmentDay1)).toBeUndefined();
      });
    });

    context('when seller was quited', () => {
      beforeEach(() => {
        seller.addAppointment(floristPost.postId, appointmentDay1);
        seller.addAppointment(seniorFloristPost.postId, appointmentDay2);
        seller.takeQuit(appointmentDay3);
      });

      test('should be undefined at today', () => {
        expect(seller.seniorityAt()).toBeUndefined();
      });

      test('should be a integer at day before quit', () => {
        expect(seller.seniorityAt(appointmentDay3.prev())).toBe(1);
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
        seller.addAppointment(floristPost.postId, appointmentDay3);
        seller.addAppointment(floristPost.postId, appointmentDay1);
        seller.addAppointment(seniorFloristPost.postId, appointmentDay2);

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
    let appDay1;
    let appDay2;
    let appDay3;
    let appDay4;
    let appDay5;
    let appDay6;
    let appDay7;
    let appDay8;
    let appDay9;
    let appDay10;

    context('when seller have appointments', () => {
      beforeEach(() => {
        appDay1 = new Day({ value: new Date('2017.01.01 12:45') });
        appDay2 = new Day({ value: new Date('2017.02.01 12:45') });
        appDay3 = new Day({ value: new Date('2017.03.01 12:45') });
        appDay4 = new Day({ value: new Date('2017.04.01 12:45') });
        appDay5 = new Day({ value: new Date('2017.05.01 12:45') });
        appDay6 = new Day({ value: new Date('2017.06.01 12:45') });
        appDay7 = new Day({ value: new Date('2017.07.01 12:45') });
        appDay8 = new Day({ value: new Date('2017.08.01 12:45') });
        appDay9 = new Day({ value: new Date('2017.09.01 12:45') });
        appDay10 = new Day({ value: new Date('2017.10.01 12:45') });

        seller.addAppointment(floristPost.postId, appDay1);
        seller.takeQuit(appDay2);
        seller.addAppointment(floristPost.postId, appDay3);
        seller.addAppointment(seniorFloristPost.postId, appDay4);
        seller.takeQuit(appDay5);
        seller.addAppointment(floristPost.postId, appDay6);
        seller.takeQuit(appDay7);
        seller.addAppointment(floristPost.postId, appDay8);
        seller.addAppointment(seniorFloristPost.postId, appDay9);
        seller.takeQuit(appDay10);
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

        expect(seller.getQuitDayAt(day).equals(appDay2)).toBeTruthy();
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

        expect(seller.getQuitDayAt(day).equals(appDay5)).toBeTruthy();
      });

      test('should return undefined at 15.06.2017', () => {
        const day = new Day({ value: new Date('2017.06.15') });

        expect(seller.getQuitDayAt(day)).toBeUndefined();
      });

      test('should return quit day at 15.07.2017', () => {
        const day = new Day({ value: new Date('2017.07.15') });

        expect(seller.getQuitDayAt(day).equals(appDay7)).toBeTruthy();
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

        expect(seller.getQuitDayAt(day).equals(appDay10)).toBeTruthy();
      });
    });

    context('when seller have no appointments', () => {
      test('should return undefined', () => {
        expect(seller.getQuitDayAt()).toBeUndefined();
      });
    });
  });

  describe('#getRecruitDayAt', () => {
    let appDay1;
    let appDay2;
    let appDay3;
    let appDay4;
    let appDay5;
    let appDay6;
    let appDay7;
    let appDay8;
    let appDay9;
    let appDay10;

    context('when seller have appointments', () => {
      beforeEach(() => {
        appDay1 = new Day({ value: new Date('2017.01.01 12:45') });
        appDay2 = new Day({ value: new Date('2017.02.01 12:45') });
        appDay3 = new Day({ value: new Date('2017.03.01 12:45') });
        appDay4 = new Day({ value: new Date('2017.04.01 12:45') });
        appDay5 = new Day({ value: new Date('2017.05.01 12:45') });
        appDay6 = new Day({ value: new Date('2017.06.01 12:45') });
        appDay7 = new Day({ value: new Date('2017.07.01 12:45') });
        appDay8 = new Day({ value: new Date('2017.08.01 12:45') });
        appDay9 = new Day({ value: new Date('2017.09.01 12:45') });
        appDay10 = new Day({ value: new Date('2017.10.01 12:45') });

        seller.addAppointment(floristPost.postId, appDay1);
        seller.takeQuit(appDay2);
        seller.addAppointment(floristPost.postId, appDay3);
        seller.addAppointment(seniorFloristPost.postId, appDay4);
        seller.takeQuit(appDay5);
        seller.addAppointment(floristPost.postId, appDay6);
        seller.takeQuit(appDay7);
        seller.addAppointment(floristPost.postId, appDay8);
        seller.addAppointment(seniorFloristPost.postId, appDay9);
        seller.takeQuit(appDay10);
      });

      test('should return undefined at 15.12.2016', () => {
        const day = new Day({ value: new Date('2016.12.15') });

        expect(seller.getRecruitDayAt(day)).toBeUndefined();
      });

      test('should return recruit day at 15.01.2017', () => {
        const day = new Day({ value: new Date('2017.01.15') });

        expect(seller.getRecruitDayAt(day).equals(appDay1)).toBeTruthy();
      });

      test('should return undefined at 15.02.2017', () => {
        const day = new Day({ value: new Date('2017.02.15') });

        expect(seller.getRecruitDayAt(day)).toBeUndefined();
      });

      test('should return recruit day at 15.03.2017', () => {
        const day = new Day({ value: new Date('2017.03.15') });

        expect(seller.getRecruitDayAt(day).equals(appDay3)).toBeTruthy();
      });

      test('should return recruit day at 15.04.2017', () => {
        const day = new Day({ value: new Date('2017.04.15') });

        expect(seller.getRecruitDayAt(day).equals(appDay3)).toBeTruthy();
      });

      test('should return undefined at 15.05.2017', () => {
        const day = new Day({ value: new Date('2017.05.15') });

        expect(seller.getRecruitDayAt(day)).toBeUndefined();
      });

      test('should return recruit day at 15.06.2017', () => {
        const day = new Day({ value: new Date('2017.06.15') });

        expect(seller.getRecruitDayAt(day).equals(appDay6)).toBeTruthy();
      });

      test('should return undefined at 15.07.2017', () => {
        const day = new Day({ value: new Date('2017.07.15') });

        expect(seller.getRecruitDayAt(day)).toBeUndefined();
      });

      test('should return recruit day at 15.08.2017', () => {
        const day = new Day({ value: new Date('2017.08.15') });

        expect(seller.getRecruitDayAt(day).equals(appDay8)).toBeTruthy();
      });

      test('should return recruit day at 15.09.2017', () => {
        const day = new Day({ value: new Date('2017.09.15') });

        expect(seller.getRecruitDayAt(day).equals(appDay8)).toBeTruthy();
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
    let appDay1;
    let appDay2;
    let appDay3;
    let appDay4;
    let appDay5;
    let appDay6;
    let appDay7;
    let appDay8;
    let appDay9;
    let appDay10;

    context('when seller have appointments', () => {
      beforeEach(() => {
        appDay1 = new Day({ value: new Date('2017.01.01 12:45') });
        appDay2 = new Day({ value: new Date('2017.02.01 12:45') });
        appDay3 = new Day({ value: new Date('2017.03.01 12:45') });
        appDay4 = new Day({ value: new Date('2017.04.01 12:45') });
        appDay5 = new Day({ value: new Date('2017.05.01 12:45') });
        appDay6 = new Day({ value: new Date('2017.06.01 12:45') });
        appDay7 = new Day({ value: new Date('2017.07.01 12:45') });
        appDay8 = new Day({ value: new Date('2017.08.01 12:45') });
        appDay9 = new Day({ value: new Date('2017.09.01 12:45') });
        appDay10 = new Day({ value: new Date('2017.10.01 12:45') });

        seller.addAppointment(floristPost.postId, appDay1);
        seller.takeQuit(appDay2);
        seller.addAppointment(floristPost.postId, appDay3);
        seller.addAppointment(seniorFloristPost.postId, appDay4);
        seller.takeQuit(appDay5);
        seller.addAppointment(floristPost.postId, appDay6);
        seller.takeQuit(appDay7);
        seller.addAppointment(floristPost.postId, appDay8);
        seller.addAppointment(seniorFloristPost.postId, appDay9);
        seller.takeQuit(appDay10);
      });

      test('should return an array with one appointment at 15.01.2017', () => {
        const day = new Day({ value: new Date('2017.01.15') });

        const appointments = seller.getAppointmentsAt(day);
        expect(appointments).toHaveLength(1);
        expect(seller.getAppointmentsAt().length).toBe(0);
        expect(appointments[0].postId).toBe(floristPost.postId);
        expect(appointments[0].day).toBe(appDay1);
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
        expect(appointments[0].day).toBe(appDay3);
      });

      test('should return an array with two appointment at 15.04.2017', () => {
        const day = new Day({ value: new Date('2017.04.15') });

        const appointments = seller.getAppointmentsAt(day);
        expect(appointments).toHaveLength(2);
        expect(appointments[0].postId).toBe(floristPost.postId);
        expect(appointments[0].day).toBe(appDay3);
        expect(appointments[1].postId).toBe(seniorFloristPost.postId);
        expect(appointments[1].day).toBe(appDay4);
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
        expect(appointments[0].day).toBe(appDay6);
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
        expect(appointments[0].day).toBe(appDay8);
      });

      test('should return an array with two appointment at 15.09.2017', () => {
        const day = new Day({ value: new Date('2017.09.15') });

        const appointments = seller.getAppointmentsAt(day);
        expect(appointments).toHaveLength(2);
        expect(appointments[0].postId).toBe(floristPost.postId);
        expect(appointments[0].day).toBe(appDay8);
        expect(appointments[1].postId).toBe(seniorFloristPost.postId);
        expect(appointments[1].day).toBe(appDay9);
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
        seller.addAppointment(floristPost.postId, appointmentDay1);
        seller.addAppointment(seniorFloristPost.postId, appointmentDay2);
      });

      test('should be add quitPostId', () => {
        seller.takeQuit(newDay);

        expect(seller.quitDay).toEqual(newDay);
        expect(seller.appointments).toHaveLength(3);
      });

      // test('should throw exeption if quit day before reqruit day', () => {
      //   try {
      //     seller.takeQuit(appointmentDay1.prev());
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
    //       seller.takeQuit(appointmentDay1.prev());
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
        seller.addAppointment(floristPost.postId, appointmentDay1);
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
});
