import { BaseEntity } from '../../_lib';
import { errors } from '../../errors';
import { SellerId, PostId, PersonName, Day, Diary } from '../../commonTypes';

// Hadnle errors throw inside Diary class

const diaryOperationRunner = (operation) => {
  try {
    return operation();
  } catch (error) {
    throw dispatchDiaryError(error);
  }
};

const dispatchDiaryError = (originalError) => {
  const error = diaryErrorMessages[originalError.message];
  error.originalError = originalError;

  return error;
};

const diaryErrorMessages = {
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

// FSM

const states = {
  NEW: 'new',
  RECRUITED: 'recruited',
  DISMISSED: 'dismissed',
  DELETED: 'deleted',
};

const transitions = {
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
    appointments,
  }) {
    const seller = new Seller({
      sellerId,
      firstName,
      middleName,
      lastName,
      phone,
    });

    if (appointments !== undefined) {
      seller._appointments = Diary.restore(
        appointments.map(({ postId, day }) => ({ value: postId, day })),
        PostId.dismissPostId
      );
    }

    seller.setState(calculateState(seller));

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
    ],

    methods: {
      onInvalidTransition(transition, from) {
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

      onAddAppointment(lifecycle, postId, day = new Day()) {
        return diaryOperationRunner(() => this._appointments.add(postId, day));
      },

      onDeleteAppointmentAt(lifecycle, day = new Day()) {
        return diaryOperationRunner(() => this._appointments.deleteAt(day));
      },

      onUpdateAppointmentTo(lifecycle, day, newPostId, newDay = new Day()) {
        return diaryOperationRunner(() =>
          this._appointments.updateTo(day, newPostId, newDay)
        );
      },

      onDismissAt(lifecycle, day = new Day()) {
        return diaryOperationRunner(() => this._appointments.addCloseAt(day));
      },

      onDeleteDismiss() {
        return diaryOperationRunner(() => this._appointments.deleteClose());
      },

      onUpdateDismissTo(lifecycle, day = new Day()) {
        return diaryOperationRunner(() =>
          this._appointments.updateCloseTo(day)
        );
      },
    },
  };

  constructor({
    sellerId = new SellerId(),
    lastName,
    firstName,
    middleName,
    phone,
  }) {
    super(sellerId);
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

  update({ lastName, firstName, middleName, phone }) {
    this._personName = new PersonName({
      lastName,
      firstName,
      middleName,
    });

    this.phone = phone;
  }
}
