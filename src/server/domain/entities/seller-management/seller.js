/* eslint-disable no-underscore-dangle */
import { getSyncOperationRunner } from '@infra/support/operation-runner';

import { BaseEntity } from '../../_lib';
import { loop, getLifecycleEvenName } from '../../_lib/base-methods';
import { errors } from '../../errors';
import { Seller as states } from '../../states';
import { SellerId, PostId, PersonName, Day, Diary } from '../../common-types';

// Hadnle errors threw inside Diary class

const diaryErrorMessageMapper = {
  RECORD_ALREADY_EXISTS: errors.appointmentAlreadyExists(),
  RECORD_DUPLICATE: errors.appointmentDuplicate(),
  RECORD_NOT_FOUND: errors.appointmentNotFound(),
  RECORD_HAS_EQUAL_NEIGHBOURS: errors.appointmentHasEqualNeighbours(),
  RECORD_HAS_LIMITED_SCOPE: errors.appointmentHasLimitedScope(),
  NEW_RECORD_ALREADY_EXISTS: errors.newAppointmentAlreadyExists(),
  NEW_RECORD_DUPLICATE: errors.newAppointmentDuplicate(),
  DIARY_IS_CLOSED: errors.carrerIsClosed(),
  DIARY_IS_NOT_STARTED: errors.sellerIsNotRecruited(),
  DIARY_HAS_RECORDS_LATER: errors.sellerHasAppointmentsLater(),
  DIARY_IS_NOT_CLOSED: errors.sellerIsNotDismissed(),
};
const diaryOperationRunner = getSyncOperationRunner(diaryErrorMessageMapper);

// FSM

const transitions = {
  UPDATE: 'update',
  ADD_APPOINTMENT: 'addAppointment',
  DELETE_APPOINTMENT_AT: 'deleteAppointmentAt',
  UPDATE_APPOINTMENT_TO: 'updateAppointmentTo',
  DISMISS_AT: 'dismissAt',
  DELETE_DISMISS: 'deleteDismiss',
  UPDATE_DISMISS_TO: 'updateDismissTo',
  DELETE: 'delete',
  RESTORE: 'restore',
};

const stateTransitionFunctions = {
  [transitions.DELETE_APPOINTMENT_AT]() {
    if (this._appointments.length === 1) {
      if (this._appointments.archiveLength === 0) {
        return states.NEW;
      }

      return states.DISMISSED;
    }

    return states.RECRUITED;
  },

  UNCHANGE_STATE() {
    return this.state;
  },
};

const calculateState = ({ _appointments }) => {
  switch (_appointments.state) {
    case 'new':
      return states.NEW;
    case 'started':
      return states.RECRUITED;
    case 'closed':
      return states.DISMISSED;
    default:
      throw errors.inconsistentState;
  }
};

export default class Seller extends BaseEntity {
  // Factories

  static restore({
    sellerId: sellerIdValue,
    firstName,
    middleName,
    lastName,
    phone,
    state,
    appointments,
    ...props
  }) {
    const sellerId = sellerIdValue && new SellerId({ value: sellerIdValue });
    const seller = new Seller({
      sellerId,
      firstName,
      middleName,
      lastName,
      phone,
      appointments,
      ...props,
    });

    if (appointments !== undefined) {
      seller._appointments = Diary.restore(
        appointments.map(({ postId, day }) => ({
          value: new PostId({ value: postId }),
          day,
        })),
        PostId.dismissPostId
      );
    }

    seller.setState(state);

    return seller;
  }

  static instanceAt(
    { firstName, middleName, lastName, phone, _appointments, ...props },
    day = new Day()
  ) {
    const seller = new Seller({
      firstName,
      middleName,
      lastName,
      phone,
      ...props,
    });

    seller._appointments = Diary.instanceAt(_appointments, day);
    seller.setState(calculateState(seller));

    return seller;
  }

  // FSM description

  static fsm = {
    init: states.NEW,
    transitions: [
      {
        name: transitions.UPDATE,
        from: '*',
        to: loop,
      },
      {
        name: transitions.ADD_APPOINTMENT,
        from: [states.NEW, states.RECRUITED, states.DISMISSED],
        to: states.RECRUITED,
      },
      {
        name: transitions.DELETE_APPOINTMENT_AT,
        from: states.RECRUITED,
        to: stateTransitionFunctions[transitions.DELETE_APPOINTMENT_AT],
      },
      {
        name: transitions.UPDATE_APPOINTMENT_TO,
        from: states.RECRUITED,
        to: states.RECRUITED,
      },
      {
        name: transitions.DISMISS_AT,
        from: states.RECRUITED,
        to: states.DISMISSED,
      },
      {
        name: transitions.DELETE_DISMISS,
        from: states.DISMISSED,
        to: states.RECRUITED,
      },
      {
        name: transitions.UPDATE_DISMISS_TO,
        from: states.DISMISSED,
        to: states.DISMISSED,
      },
      {
        name: transitions.DELETE,
        from: states.DISMISSED,
        to: states.DELETED,
      },
      {
        name: transitions.RESTORE,
        from: states.DELETED,
        to: states.DISMISSED,
      },
    ],

    methods: {
      onInvalidTransition(transition, from, to) {
        switch (true) {
          case from === states.DELETED:
            throw errors.sellerIsDeleted();

          case transition === transitions.DELETE:
            throw errors.sellerIsNotDismissed();

          case transition === transitions.RESTORE:
            throw errors.sellerIsNotDeleted();

          case transition === transitions.DELETE_APPOINTMENT_AT:
            throw errors.sellerIsNotRecruited();

          case transition === transitions.UPDATE_APPOINTMENT_TO:
            throw errors.sellerIsNotRecruited();

          case transition === transitions.DISMISS_AT:
            throw errors.sellerIsNotRecruited();

          case transition === transitions.DELETE_DISMISS:
            throw errors.sellerIsNotDismissed();

          case transition === transitions.UPDATE_DISMISS_TO:
            throw errors.sellerIsNotDismissed();

          default:
            throw errors.transitionNotAllowed(
              `Transition ${transition} for seller with id ${this.sellerId.toString()} from state ${from} to state ${to} is not allowed`
            );
        }
      },

      [getLifecycleEvenName('before', transitions.UPDATE)](
        _,
        { lastName, firstName, middleName, phone }
      ) {
        this._personName = new PersonName({
          lastName: lastName || this.lastName,
          firstName: firstName || this.firstName,
          middleName: middleName || this.middleName,
        });

        this.phone = phone || this.phone;
      },

      [getLifecycleEvenName('before', transitions.ADD_APPOINTMENT)](
        _,
        postId,
        day = new Day()
      ) {
        return diaryOperationRunner(() => this._appointments.add(postId, day));
      },

      [getLifecycleEvenName('before', transitions.DELETE_APPOINTMENT_AT)](
        _,
        day = new Day()
      ) {
        return diaryOperationRunner(() => this._appointments.deleteAt(day));
      },

      [getLifecycleEvenName('before', transitions.UPDATE_APPOINTMENT_TO)](
        _,
        day,
        newPostId,
        newDay = new Day()
      ) {
        return diaryOperationRunner(() =>
          this._appointments.updateTo(day, newPostId, newDay)
        );
      },

      [getLifecycleEvenName('before', transitions.DISMISS_AT)](
        _,
        day = new Day()
      ) {
        return diaryOperationRunner(() => this._appointments.addCloseAt(day));
      },

      [getLifecycleEvenName('before', transitions.DELETE_DISMISS)]() {
        return diaryOperationRunner(() => this._appointments.deleteClose());
      },

      [getLifecycleEvenName('before', transitions.UPDATE_DISMISS_TO)](
        _,
        day = new Day()
      ) {
        return diaryOperationRunner(() =>
          this._appointments.updateCloseTo(day)
        );
      },

      [getLifecycleEvenName('after', transitions.DELETE)]() {
        this.deletedAt = new Date();
      },
      [getLifecycleEvenName('after', transitions.RESTORE)]() {
        this.deletedAt = null;
      },
    },
  };

  constructor({
    sellerId = new SellerId(),
    lastName,
    firstName,
    middleName,
    phone,
    ...props
  }) {
    super({ id: sellerId, ...props });
    this._personName = new PersonName({
      lastName,
      firstName,
      middleName,
    });
    this.phone = phone;

    this._appointments = new Diary();

    // this.vacations;
  }

  get fullName() {
    return this._personName.fullName;
  }

  get lastName() {
    return this._personName.lastName;
  }

  get firstName() {
    return this._personName.firstName;
  }

  get middleName() {
    return this._personName.middleName;
  }

  get appointments() {
    return this._appointments.records.map(({ value, day }) => ({
      postId: value,
      day,
    }));
  }

  get postId() {
    return this._appointments.recordValue;
  }

  get postIds() {
    return this._appointments.recordValues;
  }

  get recruitDay() {
    return this._appointments.startDay;
  }

  get dismissDay() {
    return this._appointments.closeDay;
  }

  get seniority() {
    if (!this.is(states.RECRUITED)) {
      return undefined;
    }

    return new Day().differenceInMonths(this.recruitDay);
  }

  get flatAppointments() {
    return this._appointments
      .getFlatRecords(PostId.dismissPostId)
      .map(({ value, day }) => ({
        postId: value,
        day,
      }));
  }
}
