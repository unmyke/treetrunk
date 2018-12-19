import { getSyncOperationRunner } from 'src/infra/support/operationRunner';

import { BaseEntity } from '../../_lib';
import { loop } from '../../_lib/BaseMethods';
import { errors } from '../../errors';
import { Seller as states } from '../../states';
import { SellerId, PostId, PersonName, Day, Diary } from '../../commonTypes';

// Hadnle errors throw inside Diary class

const diaryErrorMessageMapper = {
  RECORD_ALREADY_EXISTS: errors.appointmentAlreadyExists(),
  RECORD_DUPLICATE: errors.appointmentDuplicate(),
  RECORD_NOT_FOUND: errors.appointmentNotFound(),
  RECORD_HAS_EQUAL_NEIGHBOURS: errors.appointmentHasEqualNeighbours(),
  RECORD_HAS_LIMITED_SCOPE: errors.appointmentHasLimitedScope(),
  NEW_RECORD_ALREADY_EXISTS: errors.newAppointmentAlreadyExists(),
  NEW_RECORD_DUPLICATE: errors.newAppointmentDuplicate(),
  DIARY_CLOSED: errors.carrerClosed(),
  DIARY_NOT_STARTED: errors.sellerNotRecruited(),
  DIARY_HAS_RECORDS_LATER: errors.sellerHasAppointmentsLater(),
  DIARY_NOT_CLOSED: errors.sellerNotDismissed(),
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
};

const stateTransitionFunctions = {
  [transitions.DELETE_APPOINTMENT_AT]: function() {
    if (this._appointments.length === 1) {
      if (this._appointments.archiveLength === 0) {
        return states.NEW;
      }

      return states.DISMISSED;
    }

    return states.RECRUITED;
  },

  UNCHANGE_STATE: function() {
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

export class Seller extends BaseEntity {
  // Factories

  static restore({
    sellerId,
    firstName,
    middleName,
    lastName,
    phone,
    state,
    appointments,
    createdAt,
  }) {
    const seller = new Seller({
      sellerId,
      firstName,
      middleName,
      lastName,
      phone,
      createdAt,
    });

    if (appointments !== undefined) {
      seller._appointments = Diary.restore(
        appointments.map(({ postId, day }) => ({ value: postId, day })),
        PostId.dismissPostId
      );
    }

    seller.setState(state);

    return seller;
  }

  static instanceAt(
    { firstName, middleName, lastName, phone, _appointments },
    day = new Day()
  ) {
    const seller = new Seller({ firstName, middleName, lastName, phone });

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
    ],

    methods: {
      onBeforeInvalidTransition(transition, from) {
        switch (from) {
          case states.DELETED:
            throw errors.sellerDeleted();
        }

        switch (transition) {
          case transitions.DELETE_APPOINTMENT_AT:
            throw errors.sellerNotRecruited();

          case transitions.UPDATE_APPOINTMENT_TO:
            throw errors.sellerNotRecruited();

          case transitions.DISMISS_AT:
            throw errors.sellerNotRecruited();

          case transitions.DELETE_DISMISS:
            throw errors.sellerNotDismissed();

          case transitions.UPDATE_DISMISS_TO:
            throw errors.sellerNotDismissed();

          default:
            throw errors.transitionNotAllowed();
        }
      },

      onBeforeUpdate(_, { lastName, firstName, middleName, phone }) {
        this._personName = new PersonName({
          lastName: lastName || this.lastName,
          firstName: firstName || this.firstName,
          middleName: middleName || this.middleName,
        });

        this.phone = phone || this.phone;
      },

      onBeforeAddAppointment(_, postId, day = new Day()) {
        return diaryOperationRunner(() => this._appointments.add(postId, day));
      },

      onBeforeDeleteAppointmentAt(_, day = new Day()) {
        return diaryOperationRunner(() => this._appointments.deleteAt(day));
      },

      onBeforeUpdateAppointmentTo(_, day, newPostId, newDay = new Day()) {
        return diaryOperationRunner(() =>
          this._appointments.updateTo(day, newPostId, newDay)
        );
      },

      onBeforeDismissAt(_, day = new Day()) {
        return diaryOperationRunner(() => this._appointments.addCloseAt(day));
      },

      onBeforeDeleteDismiss() {
        return diaryOperationRunner(() => this._appointments.deleteClose());
      },

      onBeforeUpdateDismissTo(_, day = new Day()) {
        return diaryOperationRunner(() =>
          this._appointments.updateCloseTo(day)
        );
      },

      onAfterTransition() {
        this.updatedAt = new Date();
      },
    },
  };

  constructor({
    sellerId = new SellerId(),
    lastName,
    firstName,
    middleName,
    phone,
    createdAt = new Date(),
    updatedAt,
  }) {
    super(sellerId);
    this._personName = new PersonName({
      lastName,
      firstName,
      middleName,
    });
    this.phone = phone;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

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
      return;
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
