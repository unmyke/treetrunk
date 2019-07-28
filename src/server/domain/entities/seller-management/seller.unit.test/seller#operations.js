import { Seller, Post, PostId, Day, states } from './imports';

const appointsToRecords = (appoints) =>
  appoints.map(({ postId, day }) => ({ value: postId, day }));
const lastName = 'lastName';
const firstName = 'Firstname';
const middleName = 'Middlename';
const phone = '55-66-00';
const personalName = { lastName, firstName, middleName, phone };

const day1 = new Day({ value: new Date('2017.01.01 00:00:00.000+08:00') });
const day2 = new Day({ value: new Date('2017.02.01 00:00:00.000+08:00') });
const day3 = new Day({ value: new Date('2017.03.01 00:00:00.000+08:00') });
const day4 = new Day({ value: new Date('2017.04.01 00:00:00.000+08:00') });
const day5 = new Day({ value: new Date('2017.05.01 00:00:00.000+08:00') });
const day6 = new Day({ value: new Date('2017.06.01 00:00:00.000+08:00') });
const day7 = new Day({ value: new Date('2017.07.01 00:00:00.000+08:00') });
const day8 = new Day({ value: new Date('2017.08.01 00:00:00.000+08:00') });
const day9 = new Day({ value: new Date('2017.09.01 00:00:00.000+08:00') });
const day = new Day();

const { postId: pastPostId1 } = new Post({ name: 'Флорист-пенсионер' });
const { postId: postId1 } = new Post({ name: 'Младший флорист' });
const { postId: postId2 } = new Post({ name: 'Флорист' });
const { postId: newPostId } = new Post({ name: 'Цветочество' });
const { postId: dismissPostId } = new Post({ name: 'уволен(а)' });

const pastAppoint1 = { postId: pastPostId1, day: day1 };
const appoint1 = { postId: postId1, day: day5 };
const appoint2 = { postId: postId2, day: day7 };
const appoint3 = { postId: postId1, day: day9 };
const closeAppoint = { postId: dismissPostId, day: day3 };
const newAppoint = { postId: newPostId, day: day4 };
const newAppointFromScope = { postId: newPostId, day: day8 };
const newAppointWithSameDay = { postId: newPostId, day: day5 };
const newAppointWithSamePostId = { postId: postId1, day: day6 };
const newPastAppoint = { postId: newPostId, day: day2 };

PostId.dismissPostId = dismissPostId;

let seller;

describe('Domain :: commonTypes :: Seller', () => {
  context('when seller is new', () => {
    beforeEach(() => {
      seller = Seller.restore({
        ...personalName,
        phone,
        state: states.NEW,
        appointments: [],
      });
    });

    describe('#addAppointments', () => {
      context('when passed appoint', () => {
        test('should change appoints', () => {
          seller.addAppointment(appoint1.postId, appoint1.day);

          expect(seller.appointments).toEqual([appoint1]);
        });
      });
    });

    describe('#deleteAppointmentAt', () => {
      context('when passed any appoint', () => {
        test('should throw exception and leave appoints unchanged', () => {
          expect(() => {
            seller.deleteAppointmentAt(newAppoint.day);
          }).toThrowError('SELLER_IS_NOT_RECRUITED');

          expect(seller._appointments.length).toBe(0);
          expect(seller._appointments.archiveLength).toBe(0);
        });
      });
    });

    describe('#updateAppointmentTo', () => {
      context('when passed any appoint', () => {
        test('should throw exception and leave appoints unchanged', () => {
          expect(() => {
            seller.updateAppointmentTo(
              appoint1.day,
              newAppoint.postId,
              newAppoint.day
            );
          }).toThrowError('SELLER_IS_NOT_RECRUITED');

          expect(seller._appointments.length).toBe(0);
          expect(seller._appointments.archiveLength).toBe(0);
        });
      });
    });

    describe('#dismissAt', () => {
      context('when passed any day', () => {
        test('should throw exception and leave appoints unchanged', () => {
          expect(() => {
            seller.dismissAt(day1);
          }).toThrowError('SELLER_IS_NOT_RECRUITED');

          expect(seller._appointments.length).toBe(0);
          expect(seller._appointments.archiveLength).toBe(0);
        });
      });
    });

    describe('#deleteDismiss', () => {
      test('should throw exception and leave appoints unchanged', () => {
        expect(() => {
          seller.deleteDismiss();
        }).toThrowError('SELLER_IS_NOT_DISMISSED');

        expect(seller._appointments.length).toBe(0);
        expect(seller._appointments.archiveLength).toBe(0);
      });
    });

    describe('#updateDismissTo', () => {
      context('when passed any day', () => {
        test('should throw exception and leave appoints unchanged', () => {
          expect(() => {
            seller.updateDismissTo(day1);
          }).toThrowError('SELLER_IS_NOT_DISMISSED');

          expect(seller._appointments.length).toBe(0);
          expect(seller._appointments.archiveLength).toBe(0);
        });
      });
    });
  });

  context('when seller is recruited', () => {
    beforeEach(() => {
      seller = Seller.restore({
        ...personalName,
        phone,
        state: states.RECRUITED,
        appointments: [
          pastAppoint1,
          appoint1,
          appoint2,
          appoint3,
          closeAppoint,
        ],
      });
    });

    describe('#addAppointments', () => {
      context('when passed appoint with existing day', () => {
        test('should throw exception and leave appoints unchanged', () => {
          expect(() => {
            seller.addAppointment(
              newAppointWithSameDay.postId,
              newAppointWithSameDay.day
            );
          }).toThrowError('APPOINTMENT_ALREADY_EXISTS');

          expect(seller.appointments).toEqual([appoint1, appoint2, appoint3]);
          expect(seller._appointments._archive.map(({ day }) => day)).toEqual([
            day3,
          ]);
          expect(seller._appointments._archive.get(day3).value.size).toBe(1);
        });
      });

      context('when passed appoint with equal postId', () => {
        test('should throw exception and leave appoints unchanged', () => {
          expect(() => {
            seller.addAppointment(
              newAppointWithSamePostId.postId,
              newAppointWithSamePostId.day
            );
          }).toThrowError('APPOINTMENT_DUPLICATE');

          expect(seller.appointments).toEqual([appoint1, appoint2, appoint3]);
          expect(seller._appointments._archive.map(({ day }) => day)).toEqual([
            day3,
          ]);
        });
      });

      context('when passed new appoint', () => {
        test('should change appoints', () => {
          seller.addAppointment(newAppoint.postId, newAppoint.day);
          expect(seller.appointments).toEqual([
            newAppoint,
            appoint1,
            appoint2,
            appoint3,
          ]);
          expect(seller._appointments._archive.map(({ day }) => day)).toEqual([
            day3,
          ]);
        });
      });

      context('when passed appoint with day sooner than close day', () => {
        test('should throw exception and leave appoints unchanged', () => {
          expect(() => {
            seller.addAppointment(newPastAppoint.postId, newPastAppoint.day);
          }).toThrowError('CARRER_IS_CLOSED');

          expect(seller.appointments).toEqual([appoint1, appoint2, appoint3]);
          expect(seller._appointments._archive.map(({ day }) => day)).toEqual([
            day3,
          ]);
        });
      });
    });

    describe('#deleteAppointmentAt', () => {
      context('when passed non-existent appoint', () => {
        test('should throw exception and leave appoints unchanged', () => {
          expect(() => {
            seller.deleteAppointmentAt(newAppoint.day);
          }).toThrowError('APPOINTMENT_NOT_FOUND');

          expect(seller.appointments).toEqual([appoint1, appoint2, appoint3]);
          expect(seller._appointments._archive.map(({ day }) => day)).toEqual([
            day3,
          ]);
        });
      });

      context('when passed appoint with equal neighbor appoints', () => {
        test('should throw exception and leave appoints unchanged', () => {
          expect(() => {
            seller.deleteAppointmentAt(appoint2.day);
          }).toThrowError('APPOINTMENT_HAS_EQUAL_NEIGHBOURS');

          expect(seller.appointments).toEqual([appoint1, appoint2, appoint3]);
          expect(seller._appointments._archive.map(({ day }) => day)).toEqual([
            day3,
          ]);
        });
      });

      context('when passed appoint with day sooner than close day', () => {
        test('should throw exception and leave appoints unchanged', () => {
          expect(() => {
            seller.deleteAppointmentAt(newPastAppoint.day);
          }).toThrowError('CARRER_IS_CLOSED');

          expect(seller.appointments).toEqual([appoint1, appoint2, appoint3]);
          expect(seller._appointments._archive.map(({ day }) => day)).toEqual([
            day3,
          ]);
        });
      });

      context('when passed appoint without equal neighbor appoints', () => {
        test('should change appoints', () => {
          seller.deleteAppointmentAt(appoint1.day);
          expect(seller.appointments).toEqual([appoint2, appoint3]);
          expect(seller._appointments._archive.map(({ day }) => day)).toEqual([
            day3,
          ]);
        });
      });
    });

    describe('#updateAppointmentTo', () => {
      context('when passed non-existent appoint', () => {
        test('should throw exception and leave appoints unchanged', () => {
          expect(() => {
            seller.updateAppointmentTo(
              newAppoint.day,
              newAppoint.postId,
              newAppoint.day
            );
          }).toThrowError('APPOINTMENT_NOT_FOUND');

          expect(seller.appointments).toEqual([appoint1, appoint2, appoint3]);
          expect(seller._appointments._archive.map(({ day }) => day)).toEqual([
            day3,
          ]);
        });
      });

      context('when passed appoint with existing day', () => {
        test('should throw exception and leave appoints unchanged', () => {
          expect(() => {
            seller.updateAppointmentTo(
              appoint3.day,
              newAppointWithSameDay.postId,
              newAppointWithSameDay.day
            );
          }).toThrowError('APPOINTMENT_ALREADY_EXISTS');

          expect(seller.appointments).toEqual([appoint1, appoint2, appoint3]);
          expect(seller._appointments._archive.map(({ day }) => day)).toEqual([
            day3,
          ]);
        });
      });

      context('when passed appoint with equal postId', () => {
        test('should throw exception and leave appoints unchanged', () => {
          expect(() => {
            seller.updateAppointmentTo(
              appoint3.day,
              newAppointWithSamePostId.postId,
              newAppointWithSamePostId.day
            );
          }).toThrowError('APPOINTMENT_DUPLICATE');

          expect(seller.appointments).toEqual([appoint1, appoint2, appoint3]);
          expect(seller._appointments._archive.map(({ day }) => day)).toEqual([
            day3,
          ]);
        });
      });

      context(
        'when passed appoint with equal neighbor appoints and new appoint with day outside',
        () => {
          test('should throw exception and leave appoints unchanged', () => {
            expect(() => {
              seller.updateAppointmentTo(
                appoint2.day,
                newAppoint.postId,
                newAppoint.day
              );
            }).toThrowError('APPOINTMENT_HAS_LIMITED_SCOPE');

            expect(seller.appointments).toEqual([appoint1, appoint2, appoint3]);

            expect(seller._appointments._archive.map(({ day }) => day)).toEqual(
              [day3]
            );
          });
        }
      );

      context(
        'when passed appoint with equal neighbor appoints and new appoint with day within',
        () => {
          test('should change passed appoint', () => {
            seller.updateAppointmentTo(
              appoint2.day,
              newAppointFromScope.postId,
              newAppointFromScope.day
            );
            expect(seller.appointments).toEqual([
              appoint1,
              newAppointFromScope,
              appoint3,
            ]);

            expect(seller._appointments._archive.map(({ day }) => day)).toEqual(
              [day3]
            );
          });
        }
      );

      context(
        'when passed appoint with equal neighbor appoints and new appoint with new postId and same day within',
        () => {
          test('should change passed appoint', () => {
            seller.updateAppointmentTo(
              appoint2.day,
              newAppointFromScope.postId,
              appoint2.day
            );
            expect(seller.appointments).toEqual([
              appoint1,
              { postId: newAppointFromScope.postId, day: appoint2.day },
              appoint3,
            ]);

            expect(seller._appointments._archive.map(({ day }) => day)).toEqual(
              [day3]
            );
          });
        }
      );

      context('when passed appoints with day sooner than close day ', () => {
        test('should throw exception and leave appoints unchanged', () => {
          expect(() => {
            seller.updateAppointmentTo(
              pastAppoint1.day,
              newAppoint.postId,
              newAppoint.day
            );
          }).toThrowError('CARRER_IS_CLOSED');

          expect(seller.appointments).toEqual([appoint1, appoint2, appoint3]);
          expect(seller._appointments._archive.map(({ day }) => day)).toEqual([
            day3,
          ]);
        });
      });

      context(
        'when passed appoint and new appoint without equal neighbor appoints',
        () => {
          test('should change passed appoint', () => {
            seller.updateAppointmentTo(
              appoint1.day,
              newAppoint.postId,
              newAppoint.day
            );
            expect(seller.appointments).toEqual([
              newAppoint,
              appoint2,
              appoint3,
            ]);

            expect(seller._appointments._archive.map(({ day }) => day)).toEqual(
              [day3]
            );
          });
        }
      );
    });

    describe('#dismissAt', () => {
      context('when passed day is later than latest appoint day', () => {
        test('should change appoints', () => {
          seller.dismissAt(day);
          expect(seller.appointments).toHaveLength(0);
          expect(seller._appointments._archive.get(day3).value.records).toEqual(
            appointsToRecords([pastAppoint1])
          );
          expect(seller._appointments._archive.get(day).value.records).toEqual(
            appointsToRecords([appoint1, appoint2, appoint3])
          );
        });
      });

      context('when passed day is latest appoint day', () => {
        test('should throw exception and leave appoints unchanged', () => {
          expect(() => {
            seller.dismissAt(day9);
          }).toThrowError('SELLER_HAS_APPOINTMENTS_LATER');

          expect(seller.appointments).toEqual([appoint1, appoint2, appoint3]);
          expect(seller._appointments._archive.get(day3).value.records).toEqual(
            appointsToRecords([pastAppoint1])
          );
        });
      });

      context('when passed day is sooner than latest appoint day', () => {
        test('should throw exception and leave appoints unchanged', () => {
          expect(() => {
            seller.dismissAt(day8);
          }).toThrowError('SELLER_HAS_APPOINTMENTS_LATER');

          expect(seller.appointments).toEqual([appoint1, appoint2, appoint3]);
          expect(seller._appointments._archive.get(day3).value.records).toEqual(
            appointsToRecords([pastAppoint1])
          );
        });
      });
    });

    describe('#deleteDismiss', () => {
      test('should throw exception and leave appoints unchanged', () => {
        expect(() => {
          seller.deleteDismiss();
        }).toThrowError('SELLER_IS_NOT_DISMISSED');

        expect(seller.appointments).toEqual([appoint1, appoint2, appoint3]);
        expect(seller._appointments._archive.get(day3).value.records).toEqual(
          appointsToRecords([pastAppoint1])
        );
      });
    });

    describe('#updateDismissTo', () => {
      context('when passed any day', () => {
        test('should throw exception and leave appoints unchanged', () => {
          expect(() => {
            seller.updateDismissTo(day1);
          }).toThrowError('SELLER_IS_NOT_DISMISSED');

          expect(seller.appointments).toEqual([appoint1, appoint2, appoint3]);
          expect(seller._appointments._archive.get(day3).value.records).toEqual(
            appointsToRecords([pastAppoint1])
          );
        });
      });
    });
  });

  context('when seller is dismissed', () => {
    beforeEach(() => {
      seller = Seller.restore({
        ...personalName,
        phone,
        state: states.DISMISSED,
        appointments: [pastAppoint1, closeAppoint],
      });
    });

    describe('#addAppointments', () => {
      context('when seller have no appoint like new appoint', () => {
        test('should change appoints', () => {
          seller.addAppointment(appoint1.postId, appoint1.day);
          expect(seller.appointments).toEqual([appoint1]);
          expect(seller._appointments._archive.get(day3).value.records).toEqual(
            appointsToRecords([pastAppoint1])
          );
        });
      });

      context('when passed appoint with day sooner than close day', () => {
        test('should throw exception and leave appoints unchanged', () => {
          expect(() => {
            seller.addAppointment(newPastAppoint.postId, newPastAppoint.day);
          }).toThrowError('CARRER_IS_CLOSED');

          expect(seller.appointments).toHaveLength(0);
          expect(seller._appointments._archive.get(day3).value.records).toEqual(
            appointsToRecords([pastAppoint1])
          );
        });
      });
    });

    describe('#deleteAppointmentAt', () => {
      context('when passed non-existent appoint', () => {
        test('should throw exception and leave appoints unchanged', () => {
          expect(() => {
            seller.deleteAppointmentAt(newAppoint.day);
          }).toThrowError('SELLER_IS_NOT_RECRUITED');

          expect(seller.appointments).toHaveLength(0);
          expect(seller._appointments._archive.get(day3).value.records).toEqual(
            appointsToRecords([pastAppoint1])
          );
        });
      });

      context('when passed appoint with day sooner than close day ', () => {
        test('should throw exception and leave appoints unchanged', () => {
          expect(() => {
            seller.deleteAppointmentAt(newPastAppoint.day);
          }).toThrowError('SELLER_IS_NOT_RECRUITED');

          expect(seller.appointments).toHaveLength(0);
          expect(seller._appointments._archive.get(day3).value.records).toEqual(
            appointsToRecords([pastAppoint1])
          );
        });
      });
    });

    describe('#updateAppointmentTo', () => {
      context('when passed non-existent appoint', () => {
        test('should throw exception and leave appoints unchanged', () => {
          expect(() => {
            seller.updateAppointmentTo(
              newAppoint.day,
              newAppoint.postId,
              newAppoint.day
            );
          }).toThrowError('SELLER_IS_NOT_RECRUITED');

          expect(seller.appointments).toHaveLength(0);
          expect(seller._appointments._archive.get(day3).value.records).toEqual(
            appointsToRecords([pastAppoint1])
          );
        });
      });

      context('when passed appoints with day sooner than close day ', () => {
        test('should throw exception and leave appoints unchanged', () => {
          expect(() => {
            seller.updateAppointmentTo(
              newPastAppoint.day,
              newAppoint.postId,
              newAppoint.day
            );
          }).toThrowError('SELLER_IS_NOT_RECRUITED');

          expect(seller.appointments).toHaveLength(0);
          expect(seller._appointments._archive.get(day3).value.records).toEqual(
            appointsToRecords([pastAppoint1])
          );
        });
      });
    });

    describe('#dismissAt', () => {
      context('when passed any day', () => {
        test('should throw exception and leave appoints unchanged', () => {
          expect(() => {
            seller.dismissAt(day1);
          }).toThrowError('SELLER_IS_NOT_RECRUITED');

          expect(seller.appointments).toHaveLength(0);
          expect(seller._appointments._archive.get(day3).value.records).toEqual(
            appointsToRecords([pastAppoint1])
          );
        });
      });
    });

    describe('#deleteDismiss', () => {
      test('should restore appoints', () => {
        seller.deleteDismiss();
        expect(seller.appointments).toEqual([pastAppoint1]);
        expect(seller._appointments.archiveLength).toBe(0);
      });
    });

    describe('#updateDismissTo', () => {
      context('when passed day is sooner than latest appoint day', () => {
        test('should throw exception and leave appoints unchanged', () => {
          expect(() => {
            seller.updateDismissTo(day1.prev());
          }).toThrowError('SELLER_HAS_APPOINTMENTS_LATER');

          expect(seller.appointments).toHaveLength(0);
          expect(seller._appointments._archive.get(day3).value.records).toEqual(
            appointsToRecords([pastAppoint1])
          );
        });
      });

      context('when passed day is latest appoint day', () => {
        test('should throw exception and leave appoints unchanged', () => {
          expect(() => {
            seller.updateDismissTo(day1);
          }).toThrowError('SELLER_HAS_APPOINTMENTS_LATER');

          expect(seller.appointments).toHaveLength(0);
          expect(seller._appointments._archive.get(day3).value.records).toEqual(
            appointsToRecords([pastAppoint1])
          );
        });
      });

      context('when passed day is later than latest appoint day', () => {
        test('should update close day', () => {
          seller.updateDismissTo(day9);
          expect(seller.appointments).toHaveLength(0);
          expect(seller._appointments._archive.get(day9).value.records).toEqual(
            appointsToRecords([pastAppoint1])
          );
        });
      });
    });
  });
});
