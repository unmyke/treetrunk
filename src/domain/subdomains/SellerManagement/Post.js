import { BaseEntity } from '../../_lib';
import { PostId, Day } from '../../commonTypes';
import { PieceRate } from './PieceRate';

export class Post extends BaseEntity {
  constructor({ postId = new PostId(), name, pieceRates = [] }) {
    super(postId);
    this.name = name;
    this.pieceRates = pieceRates;
  }

  get pieceRate() {
    return this.getPieceRateAt();
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
    const prevValue = this.getPieceRateAt(day);
    if (value === prevValue) {
      throw this.constructor.errorFactory.createAlreadyExists(
        pieceRate,
        `Piece rate with value: ${value} at ${day.format(
          'DD.MM.YYYY'
        )} already exists`
      );
    }

    this.pieceRates = [...this.pieceRates, pieceRate].sort(
      (a, b) => a.day > b.day
    );
  }

  getPieceRateAt(day = new Day()) {
    if (!this.hasPieceRate(day)) {
      return;
    }

    const [firstPieceRate, ...restPieceRates] = this.pieceRates;

    const { value } = restPieceRates.reduce((pieceRate, appointment) => {
      return appointment.day <= day ? appointment : pieceRate;
    }, firstPieceRate);

    return value;
  }

  editPieceRate(valueToEdit, dayToEdit, value, day) {
    const pieceRateToEdit = new PieceRate({
      value: valueToEdit,
      day: dayToEdit,
    });
    const pieceRate = new PieceRate({ value, day });

    if (pieceRateToEdit.equals(pieceRate)) {
      throw this.constructor.errorFactory.createNothingToUpdate(
        pieceRate,
        `Updated piece rate at ${day.format('DD.MM.YYYY')} for post "${
          this.name
        }" already equlas ${value}%`
      );
    }

    this.deletePieceRate(valueToEdit, dayToEdit);
    this.addPieceRate(value, day);
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

  hasPieceRate(day) {
    const [firstPieceRate] = this.pieceRates;
    return !!firstPieceRate && firstPieceRate.day <= day;
  }
  toJSON() {
    return {
      postId: this.postId.toJSON(),
      name: this.name,
      pieceRate: this.pieceRate,
      pieceRates: this.pieceRates.map((pieceRate) => pieceRate.toJSON()),
    };
  }
}
