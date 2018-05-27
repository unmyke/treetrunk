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
    return this.getPieceRateValueAt();
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

  addPieceRate(value, day) {
    const pieceRate = new PieceRate({ value, day });
    this._checkPieceRateUniqueness(pieceRate);

    this.pieceRates = [...this.pieceRates, pieceRate].sort(this._dayComparator);
  }

  editPieceRate(valueToEdit, dayToEdit, value, day) {
    const pieceRateToEdit = new PieceRate({
      value: valueToEdit,
      day: dayToEdit,
    });
    const pieceRate = new PieceRate({ value, day });

    if (pieceRate.equals(pieceRateToEdit)) {
      throw this.constructor.errorFactory.createNothingToUpdate(
        pieceRateToEdit,
        `Updated piece rate at ${day.format(
          'DD.MM.YYYY'
        )} for post "Флорист" already equlas ${value}%`
      );
    }

    this.addPieceRate(value, day);
    this.deletePieceRate(valueToEdit, dayToEdit);
  }

  deletePieceRate(value, day) {
    const pieceRateToDelete = new PieceRate({ value, day });
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

  getPieceRateValueAt(day = new Day()) {
    if (!this.hasPieceRateAt(day)) {
      return;
    }

    const [firstPieceRate, ...restPieceRates] = this.pieceRates;

    const { value } = restPieceRates.reduce((pieceRate, appointment) => {
      return appointment.day <= day ? appointment : pieceRate;
    }, firstPieceRate);

    return value;
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

  _checkPieceRateUniqueness(pieceRate) {
    if (this._isPieceRateExistsAt(pieceRate.day)) {
      throw this.constructor.errorFactory.createAlreadyExists(
        pieceRate,
        `Piece rate at ${pieceRate.day.format('DD.MM.YYYY')} already exists`
      );
    }

    const prevValue = this.getPieceRateValueAt(pieceRate.day);
    if (pieceRate.value === prevValue) {
      throw this.constructor.errorFactory.createAlreadyExists(
        pieceRate,
        `Piece rate value at ${pieceRate.day.format(
          'DD.MM.YYYY'
        )} already equals "${pieceRate.value}"`
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
