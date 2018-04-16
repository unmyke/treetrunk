import { subDays, startOfDay } from 'date-fns';
import { Contact, PersonName } from '../lib/ValueObjects';
import { Seller } from './Seller';
import { SellerId } from './SellerId';
import { Post } from '../Post';
import { Appointment } from './Appointment';

const personName = new PersonName({ surname: 'Surname', firstName: 'Firstname', middleName: 'Middlename' });
const contact = new Contact({ type: 'телефон', value: '55-66-00' });

const floristPost       = new Post({ name: 'Флорист' });
const senoirFloristPost = new Post({ name: 'Старший флорист' });

const appointmentDate1 = new Date('2018.02.14 11:00');
const appointmentDate2 = new Date('2018.03.20 11:00');
const appointmentDate3 = new Date('2018.04.14 11:00');

describe('Domain :: entities :: Seller', () => {
  let seller; 
  beforeEach(() => {
    seller = new Seller({ personName });
  });

  describe('#construcor', () => {
    context('when contruct with only person name', () => {
      it('should be instance of Seller', () => {
        expect(seller).toBeInstanceOf(Seller);
        expect(seller.id).toBeInstanceOf(SellerId);
        expect(seller.appointments).toHaveLength(0);
        expect(seller.contacts).toHaveLength(0);
      });
    });
  });

  describe('#addContact', () => {
    it('should contains new contact', () => {
      seller.addContact(contact.type, contact.value);

      expect(seller.contacts).toHaveLength(1);
      expect(seller.contacts[0].equals(contact)).toBeTruthy();
    });
  });

  describe('#appointToPostId', () => {
    context('when appoint one postId', () => {
      it('should have appointments length qual 1', () => {
        seller.appointToPostId(floristPost.id, appointmentDate1);

        expect(seller.appointments).toHaveLength(1);
      });
    });

    context('when appoint to same postId by same date', () => {
      it('should throw exeption', () => {
        seller.appointToPostId(floristPost.id, appointmentDate1);

        try {
          seller.appointToPostId(floristPost.id, appointmentDate1);
        }
        catch(e) {
          expect(e.details).toEqual(['Seller already have this post']);
          expect(seller.appointments).toHaveLength(1);
        }
      });
    });

    context('when appoint to same postId, different date, but previous postId is same', () => {
      it('should throw exeption', () => {
        seller.appointToPostId(floristPost.id, appointmentDate1);

        try {
          seller.appointToPostId(floristPost.id, new Date());
        }
        catch(e) {
          expect(e.details).toEqual(['Seller already have this post']);
          expect(seller.appointments).toHaveLength(1);
        }
      });
    });

    context('when appoint to different postId, different date, but previous postId is same', () => {
      it('should have appointments length qual 2', () => {
        seller.appointToPostId(senoirFloristPost.id, appointmentDate2);
        seller.appointToPostId(floristPost.id, appointmentDate1);

        expect(seller.appointments).toHaveLength(2);
      });
    });
  });

  describe('#getPostIdAtDate', () => {
    beforeEach(() => {
      seller.appointToPostId(senoirFloristPost.id, appointmentDate2);
      seller.appointToPostId(floristPost.id, appointmentDate3);
      seller.appointToPostId(floristPost.id, appointmentDate1);
    });

    context('when date before first appointment', () => {
      it('should return undefined', () => {
        expect(seller.getPostIdAtDate(subDays(appointmentDate1, 1))).toBeUndefined();
      });
    });

    context('when date equal second appointment date', () => {
      it('should return second appointment\'s postId', () => {
        expect(seller.getPostIdAtDate(appointmentDate2)).toBe(senoirFloristPost.id);
      });
    });

    context('when date after third appointment date', () => {
      it('should return third appointment\'s postId', () => {
        expect(seller.getPostIdAtDate(new Date())).toBe(floristPost.id);
      });
    });
  });
});
