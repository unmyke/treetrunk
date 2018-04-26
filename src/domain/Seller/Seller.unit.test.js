import { Contact, PersonName, Day } from '../_lib/ValueObjects';
import { Seller } from './Seller';
import { SellerId } from './SellerId';
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

describe('Domain :: entities :: Seller', () => {
  let seller;
  beforeEach(() => {
    seller = new Seller({ lastName, firstName, middleName, phone });
  });

  describe('#constructor', () => {
    it('should be instance of Seller', () => {
      expect(seller).toBeInstanceOf(Seller);
      expect(seller.sellerId).toBeInstanceOf(SellerId);
      expect(seller.personName).toBeInstanceOf(PersonName);
      expect(seller.fullName).toBe(`${lastName} ${firstName} ${middleName}`);
      expect(seller.phone).toBe(phone);
      expect(seller.appointments).toHaveLength(0);
    });
    it('should have set points', () => {
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
      it('should recruit seller', () => {
        expect(seller.isRecruitedAt()).toBe(true);
        expect(seller.recruitDay).toBe(appointmentDay1);
      });

      it('should return seniority not undefined', () => {
        expect(seller.seniorityAt(appointmentDay1)).not.toBeUndefined();
      });

      it('should have appointments length equal to 1', () => {
        expect(seller.appointments).toHaveLength(1);
      });
    });

    context('when appoint to same postId at same date', () => {
      it('should throw exeption', () => {
        try {
          seller.addAppointment(floristPost.postId, appointmentDay1);
        } catch (e) {
          expect(e.details).toEqual(['Seller already have this post']);
          expect(seller.appointments).toHaveLength(1);
        }
      });
    });

    context('when appoint to same postId at another date', () => {
      it('should throw exeption', () => {
        try {
          seller.addAppointment(floristPost.postId, newDay);
        } catch (e) {
          expect(e.details).toEqual(['Seller already have this post']);
          expect(seller.appointments).toHaveLength(1);
        }
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
      it('should return postId undefined', () => {
        expect(seller.getPostIdAt(appointmentDay1.subDays(1))).toBeUndefined();
      });
    });

    context('when requested past postId', () => {
      it('should return postId appointed at that day', () => {
        expect(seller.getPostIdAt(appointmentDay2)).toBe(
          seniorFloristPost.postId
        );
      });
    });

    context('when requested current postId associated with seller', () => {
      it('should return last postId', () => {
        expect(seller.getPostIdAt(newDay)).toBe(floristPost.postId);
      });
    });
  });

  describe('#deleteAppointment', () => {
    beforeEach(() => {
      seller.addAppointment(floristPost.postId, appointmentDay1);
      seller.addAppointment(seniorFloristPost.postId, appointmentDay2);
      seller.addAppointment(floristPost.postId, appointmentDay3);
    });

    context('when delete existing appointment', () => {
      it('should decrease appointments length', () => {
        expect(seller.appointments).toHaveLength(3);

        seller.deleteAppointment(floristPost.postId, appointmentDay3);

        expect(seller.getPostIdAt()).toBe(seniorFloristPost.postId);
        expect(seller.appointments).toHaveLength(2);
      });
    });

    context('when delete appointment twice', () => {
      it('should throw exeption', () => {
        seller.deleteAppointment(floristPost.postId, appointmentDay3);

        try {
          seller.deleteAppointment(floristPost.postId, appointmentDay3);
        } catch (e) {
          expect(e.details).toEqual([
            'Seller have not such appointment to this postId',
          ]);
          expect(seller.appointments).toHaveLength(2);
        }
      });
    });
  });

  describe('#editAppointment', () => {
    beforeEach(() => {
      seller.addAppointment(floristPost.postId, appointmentDay1);
    });

    context('when appointment has created with wrong postId', () => {
      it('should change associated postId', () => {
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
      it('should change associated date', () => {
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

  describe('#seniorityAt', () => {
    beforeEach(() => {
      seller.addAppointment(floristPost.postId, appointmentDay2);
    });

    context('when seller have appointments', () => {
      it('should not be undefined', () => {
        expect(seller.seniorityAt(appointmentDay3)).toBe(0);
      });
      // it("should be reset after seller's restoration", () => {
      //   seller.takeQuit();
      //   seller.restore()
      //   expect(seller.seniorityAt().toBe(0));
      // });
      it("should be undefined when requested before seller's appointment", () => {
        expect(seller.seniorityAt(appointmentDay1)).toBe(undefined);
      });
    });

    context('when seller have no appointments', () => {
      it('should be undefined', () => {
        seller.deleteAppointment(floristPost.postId, appointmentDay2);
        expect(seller.isRecruitedAt()).toBe(false);
        expect(seller.seniorityAt()).toBe(undefined);
      });
    });
  });
});
