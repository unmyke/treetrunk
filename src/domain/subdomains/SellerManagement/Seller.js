import { BaseEntity } from '../../_lib';
import { makeError, errors } from '../../errors';
import { SellerId, PostId, PersonName, Day, Diary } from '../../commonTypes';
import { Appointment } from './Appointment';

const states = {
  NEW: 'new',
  RECRUITED: 'recruited',
  VACATIONER: 'vacationer',
  DISMISSED: 'dismissed',
  DELETED: 'deleted',
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

    seller.setRecords(
      appointments.map(({ postId, day }) => ({ value: postId, day }))
    );

    return seller;
  }

  // state-transition functions

  static addAppointmentTransitionCondition() {
    switch (true) {
      case this.is(states.RECRUITED) ||
        this.is(states.NEW) ||
        this.is(states.DISMISSED):
        return states.RECRUITED;
      case this.is(states.VACATIONER):
        return this.state;
    }
  }

  static deleteAppointmentTransitionCondition() {
    if (this.isDismissed) {
      return states.DISMISSED;
    } else {
      if (this.hasAppointments === flase) {
        return states.NEW;
      } else {
        return this.state;
      }
    }
  }

  static unchangeState() {
    return this.state;
  }

  static fsm = {
    init: states.INITIALIZED,
    transitions: [
      {
        name: 'setAppointments',
        from: states.INITIALIZED,
        to: Seller.unchangeState,
      },
      {
        name: 'addAppointment',
        from: [
          states.NEW,
          states.RECRUITED,
          states.DISMISSED,
          states.VACATIONER,
        ],
        to: Seller.addAppointmentTransitionCondition,
      },
      {
        name: 'deleteAppointment',
        from: [states.RECRUITED, states.VACATIONER],
        to: Seller.deleteAppointmentTransitionCondition,
      },
      {
        name: 'updateAppointment',
        from: [states.RECRUITED, states.VACATIONER],
        to: Seller.unchangeState,
      },
      {
        name: 'update',
        from: [
          states.NEW,
          states.RECRUITED,
          states.DISMISSED,
          states.VACATIONER,
        ],
        to: Seller.unchangeState,
      },
      {
        name: 'vacate',
        from: states.RECRUITED,
        to: states.VACATIONER,
      },
      {
        name: 'hold',
        from: states.VACATIONER,
        to: states.RECRUITED,
      },
      {
        name: 'dismiss',
        from: [states.RECRUITED, states.VACATIONER],
        to: states.DISMISSED,
      },
      {
        name: 'deleteDismiss',
        from: states.DISMISSED,
        to: states.RECRUITED,
      },
      {
        name: 'delete',
        from: states.DISMISSED,
        to: states.DELETED,
      },
      {
        name: 'restore',
        from: states.DELETED,
        to: states.DISMISSED,
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
    this._personName = new PersonName({
      lastName,
      firstName,
      middleName,
    });
    this.phone = phone;

    this._appointments = new Diary({
      closeValue: PostId.dismissPostId,
      RecordClass: Appointment,
    });

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
    return this.is(states.DISMISSED);
  }

  // get isVacated() {
  //   return this.is(states.VACATIONER);
  // }

  get seniority() {
    return this.getSeniorityAt();
  }

  update({ lastName, firstName, middleName, phone }) {
    const newPersonName = new PersonName({
      ...this._personName,
      lastName,
      firstName,
      middleName,
    });

    if (this._personName.equals(newPersonName) && this.phone === phone) {
      throw this.errors.sellerNothingToUpdate();
    }

    this._personName = newPersonName;
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
