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

  // context('when seller have no appointments', () => {
  //   test('should return undefined', () => {
  //     expect(seller.getAppointmentsAt()).toEqual([]);
  //     expect(seller.getAppointmentsAt().length).toBe(0);
  //   });
  // });

  context('when seller have appointments', () => {
    beforeEach(() => {
      seller.addAppointment(floristPost.postId, appointmentDay1);
    });

    test('should return ', () => {
      expect(seller.getRecruitDayAt()).toBe(appointmentDay1);
      seller.addAppointment(quitPostId, appointmentDay2);
      seller.addAppointment(floristPost.postId, appointmentDay3);
      seller.addAppointment(quitPostId, appointmentDay4);
      // console.log(seller.appointments);
      //expect(seller.quitDay).toEqual(newDay);
      // expect(seller.getAppointmentsAt()).toHaveLength(4);
      expect(
        seller._getPostIdAppointmentsAt(newDay, floristPost.postId)
      ).toHaveLength(2);
      expect(seller._getPostIdAppointmentsAt(newDay, quitPostId)).toHaveLength(
        2
      );
      // expect(seller.);
    });
  });
});
