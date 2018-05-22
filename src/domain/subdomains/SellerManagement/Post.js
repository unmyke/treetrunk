import { BaseEntity } from '../../_lib';
import { PostId, Day } from '../../commonTypes';
import { PieceRate } from './PieceRate';

export class Post extends BaseEntity {
  static constraints = {
    name: {
      presence: { allowEmpty: false },
    },
    pieceRates: {
      presence: true,
    },
  };

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
    const previuosPieceRate = this.getPieceRateAt(day);
    const pieceRate = new PieceRate({ value, day });
    if (previuosPieceRate === pieceRate) {
      throw this.constructor.errorDuplication;
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

  editPieceRate(pieceRateToEdit, dayToEdit, pieceRate, day) {
    if (pieceRateToEdit === pieceRate && dayToEdit.equals(day)) {
      throw this.constructor.errorFactory.createNothingToUpdate(
        this,
        `Updated piece rate at ${day.format('DD.MM.YYYY')} for post "${
          this.name
        }" already equlas ${pieceRate}%`
      );
    }

    this.deletePieceRate(pieceRateToEdit, dayToEdit);
    this.addPieceRate(pieceRate, day);
  }

  deletePieceRate(value, day) {
    const pieceRateToDelete = new PieceRate({ value, day });
    const filteredPieceRates = this.pieceRates.filter(
      (pieceRate) => !pieceRate.equals(pieceRateToDelete)
    );
    if (this.pieceRates.length === filteredPieceRates.length) {
      throw this.constructor.errorFactory.createNotFound(
        this,
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
}
