import { BaseEntity } from '../_lib/BaseClasses';
import { Day } from '../_lib/ValueObjects';

import { PieceRate } from './PieceRate';
import { PostId } from './PostId';

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

  update({ name }) {
    if (name === this.name) {
      throw this.constructor.errorFactrory.createNothingToUpdate(this);
    }

    this.name = name;
  }

  setPieceRates(pieceRates) {
    this.pieceRates = pieceRates.map(
      ({ value, date }) =>
        new PieceRate({ value, day: new Day({ value: new Date(date) }) })
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

    const { value } = restPieceRates.reduce((currentPieceRate, appointment) => {
      return appointment.day <= day ? appointment : currentPieceRate;
    }, firstPieceRate);

    return value;
  }

  editPieceRate(pieceRateToEdit, dayToEdit, pieceRate, day) {
    this.deletePieceRate(pieceRateToEdit, dayToEdit);
    this.addPieceRate(pieceRate, day);
  }

  deletePieceRate(value, day) {
    const pieceRateToDelete = new PieceRate({ value, day });
    const filteredPieceRates = this.pieceRates.filter(
      (pieceRate) => !pieceRate.equals(pieceRateToDelete)
    );
    if (this.pieceRates.length === filteredPieceRates.length) {
      this.constructor.errorNoPieceRates;
    }

    this.pieceRates = filteredPieceRates;
  }

  hasPieceRate(day) {
    const [firstPieceRate] = this.pieceRates;
    return !!firstPieceRate && firstPieceRate.day <= day;
  }

  get currentPieceRate() {
    return this.getPieceRateAt();
  }
}
