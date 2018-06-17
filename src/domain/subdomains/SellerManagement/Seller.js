import { BaseEntity } from '../../_lib';
import { makeError, errors } from '../../errors';
import { SellerId, PersonName, Day } from '../../commonTypes';
import { Appointments } from './Appointments';

const sellerState = {
  vacationer: 'vacationer',
  new: '',
};

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

  static addAppointmentStateCondition() {
    switch (true) {
      case this.is(this.constructor.states.RECRUITED) ||
        this.is(this.constructor.states.NEW) ||
        this.is(this.constructor.states.DISMISSED):
        return this.constructor.states.RECRUITED;
      case this.is(this.constructor.states.VACATIONER):
        return this.state;
    }
  }

  static deleteAppointmentStateCondition() {
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
        to: Seller.addAppointmentStateCondition,
      },
      {
        name: 'deleteAppointment',
        from: [Seller.states.RECRUITED, Seller.states.VACATIONER],
        to: Seller.deleteAppointmentStateCondition,
      },
      {
        name: 'updateAppointment',
        from: [Seller.states.RECRUITED, Seller.states.VACATIONER],
        to: Seller.unchangeState,
      },
      {
        name: 'update',
        from: [Seller.states.RECRUITED, Seller.states.VACATIONER],
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
      // onActive() {
      //   this.appointmentOperationResult = { done: true };
      // },

      // update({ name })
      onBeforeUpdate(lifecycle, { name }) {
        if (name === this.name) {
          throw makeError({ name: [errors.nothingToUpdate] });
        }
      },

      onUpdate(lifecycle, { name }) {
        this.name = name;
      },

      // setAppointments({ appointments })
      onSetAppointments(lifecycle, appointmentEntries) {
        return this._appointments.setRecords({ records: appointmentEntries });
      },

      onAddAppointment(lifecycle, value, day = new Day()) {
        return this._appointments.addRecord(value, day);
      },

      onDeleteAppointment(lifecycle, value, day = new Day()) {
        return this._appointments.deleteRecord(value, day);
      },

      onUpdateAppointment(lifecycle, value, day, newValue, newDay) {
        return this._appointments.updateRecord(value, day, newValue, newDay);
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
    this._appointments = new Appointments();
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

  get quitDay() {
    return this._appointments.closedDay;
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
    return this._appointments.getRecruitDayAt(day);
  }

  isRecruitedAt(day = new Day()) {
    return this._appointments.isRecruitedAt(day);
  }

  getDismissDayAt(day = new Day()) {
    return this._appointments.getDismissDayAt(day);
  }

  isDismissedAt(day = new Day()) {
    return this._appointments.isDismissedAt(day);
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
      isRecruited: this.isRecruited,
      quitDay: this.quitDay,
      isDismissed: this.isDismissed,
      seniority: this.seniority,
      appointments: this.appointments,
    };
  }
}
