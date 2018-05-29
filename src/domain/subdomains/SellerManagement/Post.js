import { BaseEntity } from '../../_lib';
import { PostId, Day } from '../../commonTypes';
import { PieceRate } from './PieceRate';

export class Post extends BaseEntity {
  constructor({ postId = new PostId(), name, state = 'active' }) {
    super(postId);
    this.name = name;
    this.state = state;
    this.pieceRates = [];
  }

  get pieceRate() {
    return this.getPieceRateAt();
  }

  get hasPieceRates() {
    return this.hasPieceRateAt();
  }

  update({ name }) {
    if (name === this.name) {
      throw this.constructor.errorFactory.createNothingToUpdate(
        this,
        `Post already has name "${name}"`
      );
    }

    this.name = name;
  }

  setPieceRates(pieceRates) {
    this.pieceRates = pieceRates.map(
      ({ value, day }) => new PieceRate({ value, day })
    );
  }

  addPieceRate(value, day = new Day()) {
    const pieceRate = new PieceRate({ value, day });
    this._checkPieceRateUniqueness(pieceRate);

    this.pieceRates = [...this.pieceRates, pieceRate].sort(this._dayComparator);
  }

  // editPieceRate(valueToEdit, dayToEdit, value, day) {
  //   const pieceRateToEdit = new PieceRate({
  //     value: valueToEdit,
  //     day: dayToEdit,
  //   });
  //   const pieceRate = new PieceRate({ value, day });

  //   if (pieceRate.equals(pieceRateToEdit)) {
  //     throw this.constructor.errorFactory.createNothingToUpdate(
  //       pieceRateToEdit,
  //       `Updated piece rate at ${day.format(
  //         'DD.MM.YYYY'
  //       )} for post "Флорист" already equlas ${value}%`
  //     );
  //   }

  //   this.addPieceRate(value, day);
  //   this.deletePieceRate(valueToEdit, dayToEdit);
  // }

  deletePieceRate(value, day = new Day()) {
    const pieceRateToDelete = new PieceRate({ value, day });

    const prevPieceRate = this._getPrevPieceRateAt(day.prev());
    const nextPieceRate = this._getNextPieceRateAt(day);

    if (
      prevPieceRate !== undefined &&
      nextPieceRate !== undefined &&
      prevPieceRate.value === nextPieceRate.value
    ) {
      throw this.constructor.errorFactory.createNotAllowed(
        pieceRateToDelete,
        `Piece rate with value ${value} at ${day.format(
          'DD.MM.YYYY'
        )} not allowed to delete: piece rate at ${prevPieceRate.day.format(
          'DD.MM.YYYY'
        )} equals piece rate at ${nextPieceRate.day.format('DD.MM.YYYY')}`
      );
    }

    const filteredPieceRates = this.pieceRates.filter(
      (pieceRate) => !pieceRate.equals(pieceRateToDelete)
    );
    if (this.pieceRates.length === filteredPieceRates.length) {
      throw this.constructor.errorFactory.createNotFound(
        pieceRateToDelete,
        `Piece rate with value ${value} at ${day.format(
          'DD.MM.YYYY'
        )} not found`
      );
    }

    this.pieceRates = filteredPieceRates;
  }

  getPieceRateAt(day = new Day()) {
    const pieceRate = this._getPrevPieceRateAt(day);
    if (pieceRate === undefined) {
      return;
    }
    return pieceRate.value;
  }

  hasPieceRateAt(day = new Day()) {
    const [firstPieceRate] = this.pieceRates;
    return !!firstPieceRate && firstPieceRate.day <= day;
  }

  inactivate() {
    if (state === 'active') {
      this.state = 'inactive';
    }
  }

  activate() {
    if (state === 'inactive') {
      this.state = 'active';
    }
  }

  toJSON() {
    return {
      postId: this.postId.toJSON(),
      name: this.name,
      pieceRate: this.pieceRate,
      pieceRates: this.pieceRates.map((pieceRate) => pieceRate.toJSON()),
      state: this.state,
    };
  }

  // private

  _getPrevPieceRateAt(day = new Day()) {
    if (!this.hasPieceRateAt(day)) {
      return;
    }

    const [firstPieceRate, ...restPieceRates] = this.pieceRates;

    const pieceRate = restPieceRates.reduce((pieceRate, appointment) => {
      return appointment.day <= day ? appointment : pieceRate;
    }, firstPieceRate);

    return pieceRate;
  }

  _getNextPieceRateAt(day = new Day()) {
    const sortedPieceRates = this.pieceRates.sort(this._dayComparator);
    const index = sortedPieceRates.findIndex(({ day: currentDay }) => {
      return currentDay > day;
    });
    if (index === -1) {
      return;
    }

    return sortedPieceRates[index];
  }

  _checkPieceRateUniqueness(pieceRate) {
    if (this._isPieceRateExistsAt(pieceRate.day)) {
      throw this.constructor.errorFactory.createAlreadyExists(
        pieceRate,
        `Piece rate at ${pieceRate.day.format('DD.MM.YYYY')} already exists`
      );
    }

    const prevPieceRate = this._getPrevPieceRateAt(pieceRate.day);
    if (
      prevPieceRate !== undefined &&
      pieceRate.value === prevPieceRate.value
    ) {
      throw this.constructor.errorFactory.createAlreadyExists(
        pieceRate,
        `Piece rate value at ${prevPieceRate.day.format(
          'DD.MM.YYYY'
        )} already equals "${prevPieceRate.value}"`
      );
    }

    const nextPieceRate = this._getNextPieceRateAt(pieceRate.day);
    if (
      nextPieceRate !== undefined &&
      pieceRate.value === nextPieceRate.value
    ) {
      throw this.constructor.errorFactory.createAlreadyExists(
        pieceRate,
        `Piece rate value at ${nextPieceRate.day.format(
          'DD.MM.YYYY'
        )} already equals "${nextPieceRate.value}"`
      );
    }
  }

  _isPieceRateExistsAt(day = new Day()) {
    const index = this.pieceRates.findIndex(({ day: currentDay }) =>
      day.equals(currentDay)
    );

    return index !== -1;
  }
}
