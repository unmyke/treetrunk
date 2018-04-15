import { Contact, PersonName } from '../lib';
import { Saler } from './Saler';
import { SalerId } from './SalerId';
import { Post } from '../Post';
import { Appointment } from './Appointment';

const personName = new PersonName({ surname: 'Surname', firstName: 'Firstname', middleName: 'Middlename' });

const contact = new Contact({ type: 'телефон', value: '55-66-00' });

const flowistPost = new Post({
  name: 'Флорист',
});

const senoirFlowist = new Post({
  name: 'Старший флорист',
});

flowistPost.setPieceRateValue(3, new Date('2018.02.02 11:00'));
flowistPost.setPieceRateValue(4, new Date('2018.01.01 11:00'));
flowistPost.setPieceRateValue(2, new Date('2018.04.04 11:00'));
flowistPost.setPieceRateValue(1, new Date('2018.03.03 11:00'));

senoirFlowist.setPieceRateValue(6, new Date('2018.02.12 11:00'));
senoirFlowist.setPieceRateValue(5, new Date('2018.01.11 11:00'));
senoirFlowist.setPieceRateValue(4, new Date('2018.04.14 11:00'));
senoirFlowist.setPieceRateValue(3, new Date('2018.03.13 11:00'));

const appointment1 = new Appointment({
    postId: flowistPost.id,
    date: new Date('2018.02.14 11:00'),
});
const appointment2 = new Appointment({
  postId: senoirFlowist.id,
  date: new Date('2018.03.20 11:00'),
});

describe('Domain :: entities :: Saler', () => {
  let saler; 
  beforeEach(() => {
    saler = new Saler({ personName });
  });

  context('when contruct by only person name', () => {
    it('should be instance of Saler', () => {
      expect(saler).toBeInstanceOf(Saler);
      expect(saler.id).toBeInstanceOf(SalerId);
      expect(saler.appointments).toHaveLength(0);
      expect(saler.contacts).toHaveLength(0);
    });
  });

  context('when add contact', () => {
    it('should contains new contact', () => {
      saler.addContact(contact.type, contact.value);

      expect(saler.contacts).toHaveLength(1);
      expect(saler.contacts[0].equals(contact)).toBeTruthy();
    });
  });

  context('when apoint to appointment', () => {
    it('should return new appointment post id', () => {
      saler.appointByPostId(appointment1.postId, appointment1.date);

      expect(saler.appointments).toHaveLength(1);
      expect(saler.getPostIdAtDate(new Date()).equals(appointment1.postId)).toBeTruthy();
    });
  });
});
