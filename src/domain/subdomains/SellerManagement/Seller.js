import { BaseEntity } from '../../_lib';
import { makeError, errors } from '../../errors';
import { SellerId, PostId, PersonName, Day, Diary } from '../../commonTypes';
import { Appointment } from './Appointment';

export class Seller extends BaseEntity {
  // Seller states

  static states = {
    NEW: 'new',
    RECRUITED: 'recruited',
    VACATIONER: 'vacationer',
    DISMISSED: 'dismissed',
    DELETED: 'deleted',
  };

  // state-transition functions

  static addAppointmentTransitionCondition() {
    switch (true) {
      case this.is(this.constructor.states.RECRUITED) ||
        this.is(this.constructor.states.NEW) ||
        this.is(this.constructor.states.DISMISSED):
        return this.constructor.states.RECRUITED;
      case this.is(this.constructor.states.VACATIONER):
        return this.state;
    }
  }

  static deleteAppointmentTransitionCondition() {
    if (this.isDismissed) {
      return this.constructor.states.DISMISSED;
    } else {
      if (this.hasAppointments === flase) {
        return this.constructor.states.NEW;
      } else {
        return this.state;
      }
    }
  }

  static unchangeState() {
    return this.state;
  }

  static fsm = {
    init: Seller.states.NEW,
    transitions: [
      {
        name: 'setAppointments',
        from: '*',
        to: Seller.unchangeState,
      },
      {
        name: 'addAppointment',
        from: [
          Seller.states.NEW,
          Seller.states.RECRUITED,
          Seller.states.DISMISSED,
          Seller.states.VACATIONER,
        ],
        to: Seller.addAppointmentTransitionCondition,
      },
      {
        name: 'deleteAppointment',
        from: [Seller.states.RECRUITED, Seller.states.VACATIONER],
        to: Seller.deleteAppointmentTransitionCondition,
      },
      {
        name: 'updateAppointment',
        from: [Seller.states.RECRUITED, Seller.states.VACATIONER],
        to: Seller.unchangeState,
      },
      {
        name: 'update',
        from: [
          Seller.states.NEW,
          Seller.states.RECRUITED,
          Seller.states.DISMISSED,
          Seller.states.VACATIONER,
        ],
        to: Seller.unchangeState,
      },
      {
        name: 'vacate',
        from: Seller.states.RECRUITED,
        to: Seller.states.VACATIONER,
      },
      {
        name: 'hold',
        from: Seller.states.VACATIONER,
        to: Seller.states.RECRUITED,
      },
      {
        name: 'dismiss',
        from: [Seller.states.RECRUITED, Seller.states.VACATIONER],
        to: Seller.states.DISMISSED,
      },
      {
        name: 'deleteDismiss',
        from: Seller.states.DISMISSED,
        to: Seller.states.RECRUITED,
      },
      {
        name: 'delete',
        from: Seller.states.DISMISSED,
        to: Seller.states.DELETED,
      },
      {
        name: 'restore',
        from: Seller.states.DELETED,
        to: Seller.states.DISMISSED,
      },
    ],

    methods: {
      onBeforeSetAppointments(lifecycle, appointments) {
        const newRecords = appointments.map(
          ({ postId, day }) => new Appointment({ postId, day })
        );
        return this._appointments.setRecords({ newRecords });
      },

      onBeforeAddAppointment(lifecycle, postId, day = new Day()) {
        const record = new Appointment({ postId, day });

        return this._appointments.addRecord({ record });
      },

      onBeforeDeleteAppointment(lifecycle, postId, day = new Day()) {
        const record = new Appointment({ postId, day });

        return this._appointments.deleteRecord({ record });
      },

      onBeforeUpdateAppointment(lifecycle, postId, day, newPostId, newDay) {
        const record = new Appointment({ postId, day });
        const newRecord = new Appointment({ postId: newPostId, day: newDay });

        return this._appointments.updateRecord({ record, newRecord });
      },

      onBeforeDismiss(lifecycle, day) {
        return this._appointments.dismiss({ day });
      },

      onDeleteDismiss() {
        return this._appointments.deleteDismiss();
      },

      // update({ name })
      onBeforeUpdate(lifecycle, { name }) {
        if (name === this.name) {
          throw makeError({ name: [errors.nothingToUpdate] });
        }
      },

      onUpdate(lifecycle, { name }) {
        this.name = name;
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
    this.personName = new PersonName({
      lastName,
      firstName,
      middleName,
    });
    this.phone = phone;

    this._appointments = new Diary({
      closeValue: PostId.dismissPostId,
      RecordClass: Appointment,
    });

    this.vacations;
  }

  get fullName() {
    return this.personName.fullName;
  }

  get lastName() {
    return this.personName.lastName;
  }

  get firstName() {
    return this.personName.firstName;
  }

  get middleName() {
    return this.personName.middleName;
  }

  get appointments() {
    return this._appointments.records;
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

  get isRecruited() {
    return this._appointments.isStarted;
  }

  get dismissDay() {
    return this._appointments.closeDay;
  }

  get isDismissed() {
    return this._appointments.isClosed;
  }

  get isVacated() {
    return this.is(this.constructor.states.VACATIONER);
  }

  get seniority() {
    return this.getSeniorityAt();
  }

  update({ lastName, firstName, middleName, phone }) {
    const newPersonName = new PersonName({
      ...this.personName,
      lastName,
      firstName,
      middleName,
    });

    if (this.personName.equals(newPersonName) && this.phone === phone) {
      throw this.errors.sellerNothingToUpdate();
    }

    this.personName = newPersonName;
    if (phone) {
      this.phone = phone;
    }
  }

  getAppointmentsAt(day = new Day()) {
    return this._appointments.getRecordsAt(day);
  }

  getPostIdAt(day = new Day()) {
    return this._appointments.getRecordValueAt(day);
  }

  getPostIdsAt(day = new Day()) {
    return this._appointments.getRecordValuesAt(day);
  }

  getRecruitDayAt(day = new Day()) {
    return this._appointments.getStartDayAt(day);
  }

  isRecruitedAt(day = new Day()) {
    return this._appointments.isStartedAt(day);
  }

  getDismissDayAt(day = new Day()) {
    return this._appointments.getCloseDayAt(day);
  }

  isDismissedAt(day = new Day()) {
    return this._appointments.isClosedAt(day);
  }

  getSeniorityAt(day = new Day()) {
    if (!this.isRecruitedAt(day)) {
      return;
    }

    return day.differenceInMonths(this.getRecruitDayAt(day));
  }

  toJSON() {
    return {
      sellerId: this.sellerId.toJSON(),
      fullName: this.fullName,
      lastName: this.lastName,
      firstName: this.firstName,
      middleName: this.middleName,
      phone: this.phone,
      postId: this.postId,
      postIds: this.postIds,
      recruitDay: this.recruitDay,
      isRecruited: this.isClosed,
      dismissDay: this.dismissDay,
      isDismissed: this.isDismissed,
      seniority: this.seniority,
      appointments: this.appointments,
    };
  }
}
