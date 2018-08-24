import { PostId, Day } from '../../commonTypes';
import { Seller } from './Seller';
import { Post } from './Post';

const states = {
  NEW: 'new',
  RECRUITED: 'recruited',
  DISMISSED: 'dismissed',
  DELETED: 'deleted',
};

const lastName = 'lastName';
const firstName = 'Firstname';
const middleName = 'Middlename';
const personalName = { lastName, firstName, middleName, phone };
const phone = '55-66-00';

const day1 = new Day({ value: new Date('2017.01.14 11:00') });
const day2 = new Day({ value: new Date('2017.02.20 11:00') });
const day3 = new Day({ value: new Date('2017.03.14 11:00') });
const day4 = new Day({ value: new Date('2017.04.16 11:00') });
const day5 = new Day({ value: new Date('2017.05.18 11:00') });
const day = new Day({ value: new Date('2017.06.01 11:00') });

const { postId: postId1 } = new Post({ name: 'Младший флорист' });
const { postId: postId2 } = new Post({ name: 'Флорист' });
const { postId: postId3 } = new Post({ name: 'Старший флорист' });
const { postId: postId4 } = new Post({ name: 'Главный флорист' });
const { postId: newPostId } = new Post({ name: 'Цветочество' });
const { postId: dismissPostId } = new Post({ name: 'уволен(а)' });

const appoint1 = { postId: postId1, day: day1 };
const appoint2 = { postId: postId2, day: day3 };
const appoint3 = { postId: postId3, day: day4 };
const dismissAppoint1 = { postId: dismissPostId, day: day2 };
const dismissAppoint2 = { postId: dismissPostId, day: day4 };

PostId.dismissPostId = dismissPostId;

let seller;

describe('Domain :: commonTypes :: Seller :: #FSM transitions', () => {
  context('when seller is new', () => {
    beforeEach(() => {
      seller = Seller.restore({ ...personalName, phone, state: states.NEW });
      expect(seller.state).toBe(states.NEW);
    });

    describe('#add', () => {
      test('should transit to started state', () => {
        seller.addAppointment(postId4, day);
        expect(seller.state).toBe(states.RECRUITED);
      });
    });

    describe('#deleteAt', () => {
      test('should throw exception and leave state unchanged', () => {
        expect(() => {
          seller.deleteAppointmentAt(day1);
        }).toThrowError('SELLER_NOT_RECRUITED');
      });
    });

    describe('#updateTo', () => {
      test('should throw exception and leave state unchanged', () => {
        expect(() => {
          seller.updateAppointmentTo(day1, newPostId, day);
        }).toThrowError('SELLER_NOT_RECRUITED');
      });
    });

    describe('#dismissAt', () => {
      test('should throw exception and leave state unchanged', () => {
        expect(() => {
          seller.dismissAt(day4);
        }).toThrowError('SELLER_NOT_RECRUITED');
      });
    });

    describe('#deleteDismiss', () => {
      test('should throw exception and leave state unchanged', () => {
        expect(() => {
          seller.deleteDismiss();
        }).toThrowError('SELLER_NOT_DISMISSED');
      });
    });

    describe('#updateDismissTo', () => {
      test('should throw exception and leave state unchanged', () => {
        expect(() => {
          seller.updateDismissTo(day4);
        }).toThrowError('SELLER_NOT_DISMISSED');
      });
    });
  });

  context('when seller is started', () => {
    context('when seller was not сlosed', () => {
      context('when seller have one appoint', () => {
        beforeEach(() => {
          seller = Seller.restore({
            ...personalName,
            phone,
            state: states.RECRUITED,
            appointments: [appoint1],
          });
          expect(seller.state).toBe(states.RECRUITED);
        });

        describe('#add', () => {
          test('should leave state unchanged', () => {
            seller.addAppointment(postId4, day);
            expect(seller.state).toBe(states.RECRUITED);
          });
        });

        describe('#deleteAt', () => {
          test('should transit to new state', () => {
            seller.deleteAppointmentAt(day1);
            expect(seller.state).toBe(states.NEW);
          });
        });

        describe('#updateTo', () => {
          test('should leave state unchanged', () => {
            seller.updateAppointmentTo(day1, newPostId, day);
            expect(seller.state).toBe(states.RECRUITED);
          });
        });

        describe('#dismissAt', () => {
          test('should transit to closed state', () => {
            seller.dismissAt(day4);
            expect(seller.state).toBe(states.DISMISSED);
          });
        });

        describe('#deleteDismiss', () => {
          test('should throw exception and leave state unchanged', () => {
            expect(() => {
              seller.deleteDismiss();
            }).toThrowError('SELLER_NOT_DISMISSED');
          });
        });

        describe('#updateDismissTo', () => {
          test('should throw exception and leave state unchanged', () => {
            expect(() => {
              seller.updateDismissTo(day4);
            }).toThrowError('SELLER_NOT_DISMISSED');
          });
        });
      });

      context('when seller have more than one appoint', () => {
        beforeEach(() => {
          seller = Seller.restore({
            ...personalName,
            phone,
            state: states.RECRUITED,
            appointments: [appoint1, appoint2],
          });
          expect(seller.state).toBe(states.RECRUITED);
        });

        describe('#add', () => {
          test('should leave state unchanged', () => {
            seller.addAppointment(postId4, day);
            expect(seller.state).toBe(states.RECRUITED);
          });
        });

        describe('#deleteAt', () => {
          test('should leave state unchanged', () => {
            seller.deleteAppointmentAt(day3);
            expect(seller.state).toBe(states.RECRUITED);
          });
        });

        describe('#updateTo', () => {
          test('should leave state unchanged', () => {
            seller.updateAppointmentTo(day3, newPostId, day);
            expect(seller.state).toBe(states.RECRUITED);
          });
        });

        describe('#dismissAt', () => {
          test('should transit to closed state', () => {
            seller.dismissAt(day4);
            expect(seller.state).toBe(states.DISMISSED);
          });
        });

        describe('#deleteDismiss', () => {
          test('should throw exception and leave state unchanged', () => {
            expect(() => {
              seller.deleteDismiss();
            }).toThrowError('SELLER_NOT_DISMISSED');
          });
        });

        describe('#updateDismissTo', () => {
          test('should throw exception and leave state unchanged', () => {
            expect(() => {
              seller.updateDismissTo(day4);
            }).toThrowError('SELLER_NOT_DISMISSED');
          });
        });
      });
    });

    context('when seller was сlosed', () => {
      context('when seller have one appoint', () => {
        beforeEach(() => {
          seller = Seller.restore({
            ...personalName,
            phone,
            state: states.RECRUITED,
            appointments: [appoint1, appoint2, dismissAppoint1],
          });
          expect(seller.state).toBe(states.RECRUITED);
        });

        describe('#add', () => {
          test('should leave state unchanged', () => {
            seller.addAppointment(postId4, day);
            expect(seller.state).toBe(states.RECRUITED);
          });
        });

        describe('#deleteAt', () => {
          test('should transit to closed state', () => {
            seller.deleteAppointmentAt(day3);
            expect(seller.state).toBe(states.DISMISSED);
          });
        });

        describe('#updateTo', () => {
          test('should leave state unchanged', () => {
            seller.updateAppointmentTo(day3, newPostId, day);
            expect(seller.state).toBe(states.RECRUITED);
          });
        });

        describe('#dismissAt', () => {
          test('should transit to closed state', () => {
            seller.dismissAt(day4);
            expect(seller.state).toBe(states.DISMISSED);
          });
        });

        describe('#deleteDismiss', () => {
          test('should throw exception and leave state unchanged', () => {
            expect(() => {
              seller.deleteDismiss();
            }).toThrowError('SELLER_NOT_DISMISSED');
          });
        });

        describe('#updateDismissTo', () => {
          test('should throw exception and leave state unchanged', () => {
            expect(() => {
              seller.updateDismissTo(day4);
            }).toThrowError('SELLER_NOT_DISMISSED');
          });
        });
      });

      context('when seller have more than one appoint', () => {
        beforeEach(() => {
          seller = Seller.restore({
            ...personalName,
            phone,
            state: states.RECRUITED,
            appointments: [appoint1, appoint2, appoint3, dismissAppoint1],
          });
          expect(seller.state).toBe(states.RECRUITED);
        });

        describe('#add', () => {
          test('should leave state unchanged', () => {
            seller.addAppointment(postId4, day);
            expect(seller.state).toBe(states.RECRUITED);
          });
        });

        describe('#deleteAt', () => {
          test('should leave state unchanged', () => {
            seller.deleteAppointmentAt(day3);
            expect(seller.state).toBe(states.RECRUITED);
          });
        });

        describe('#updateTo', () => {
          test('should leave state unchanged', () => {
            seller.updateAppointmentTo(day3, newPostId, day);
            expect(seller.state).toBe(states.RECRUITED);
          });
        });

        describe('#dismissAt', () => {
          test('should transit to closed state', () => {
            seller.dismissAt(day5);
            expect(seller.state).toBe(states.DISMISSED);
          });
        });

        describe('#deleteDismiss', () => {
          test('should throw exception and leave state unchanged', () => {
            expect(() => {
              seller.deleteDismiss();
            }).toThrowError('SELLER_NOT_DISMISSED');
          });
        });

        describe('#updateDismissTo', () => {
          test('should throw exception and leave state unchanged', () => {
            expect(() => {
              seller.updateDismissTo(day4);
            }).toThrowError('SELLER_NOT_DISMISSED');
          });
        });
      });
    });
  });

  context('when seller is closed', () => {
    context('when seller closed once', () => {
      beforeEach(() => {
        seller = Seller.restore({
          ...personalName,
          state: states.DISMISSED,
          phone,
          appointments: [appoint1, dismissAppoint1],
        });
        expect(seller.state).toBe(states.DISMISSED);
      });

      describe('#add', () => {
        test('should transit to started state', () => {
          seller.addAppointment(postId4, day);
          expect(seller.state).toBe(states.RECRUITED);
        });
      });

      describe('#deleteAt', () => {
        test('should throw exception and leave state unchanged', () => {
          expect(() => {
            seller.deleteAppointmentAt(day1);
          }).toThrowError('SELLER_NOT_RECRUITED');
        });
      });

      describe('#updateTo', () => {
        test('should throw exception and leave state unchanged', () => {
          expect(() => {
            seller.updateAppointmentTo(day1, newPostId, day);
          }).toThrowError('SELLER_NOT_RECRUITED');
        });
      });

      describe('#dismissAt', () => {
        test('should throw exception and leave state unchanged', () => {
          expect(() => {
            seller.dismissAt(day4);
          }).toThrowError('SELLER_NOT_RECRUITED');
        });
      });

      describe('#deleteDismiss', () => {
        test('should transit to started state', () => {
          seller.deleteDismiss();
          expect(seller.state).toBe(states.RECRUITED);
        });
      });

      describe('#updateDismissTo', () => {
        test('should leave state unchanged', () => {
          seller.updateDismissTo(day4);
          states.DISMISSED;
        });
      });
    });

    context('when seller closed more than once', () => {
      beforeEach(() => {
        seller = Seller.restore({
          ...personalName,
          phone,
          state: states.DISMISSED,
          appointments: [appoint1, appoint2, dismissAppoint1, dismissAppoint2],
        });
        expect(seller.state).toBe(states.DISMISSED);
      });

      describe('#add', () => {
        test('should transit to started state', () => {
          seller.addAppointment(postId4, day);
          expect(seller.state).toBe(states.RECRUITED);
        });
      });

      describe('#deleteAt', () => {
        test('should throw exception and leave state unchanged', () => {
          expect(() => {
            seller.deleteAppointmentAt(day2);
          }).toThrowError('SELLER_NOT_RECRUITED');
        });
      });

      describe('#updateTo', () => {
        test('should throw exception and leave state unchanged', () => {
          expect(() => {
            seller.updateAppointmentTo(day1, newPostId, day);
          }).toThrowError('SELLER_NOT_RECRUITED');
        });
      });

      describe('#dismissAt', () => {
        test('should throw exception and leave state unchanged', () => {
          expect(() => {
            seller.dismissAt(day4);
          }).toThrowError('SELLER_NOT_RECRUITED');
        });
      });

      describe('#deleteDismiss', () => {
        test('should transit to started state', () => {
          seller.deleteDismiss();
          expect(seller.state).toBe(states.RECRUITED);
        });
      });

      describe('#updateDismissTo', () => {
        test('should leave state unchanged', () => {
          seller.updateDismissTo(day4);
          states.DISMISSED;
        });
      });
    });
  });
});
