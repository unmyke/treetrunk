import { BaseEntity } from '../_lib/BaseClasses';
import { Day } from '../_lib/ValueObjects';
import { PieceRate } from './PieceRate';
import { PostId } from './PostId';

export class Post extends BaseEntity {
  constructor({
    postId = new PostId(),
    name,
    pieceRate,
    pieceRateDate = new Day(),
    pieceRates = []
  }) {
    super(postId);
    this.name = name;
    this.pieceRates = pieceRates;
    if (pieceRate !== undefined) {
      this.addPieceRate(pieceRate, pieceRateDate);
    }
  }

  addPieceRate(value, day) {
    const pieceRate = new PieceRate({ value, day });
    this.pieceRates = [ ...this.pieceRates, pieceRate ].sort((a, b) => a.day > b.day);
  }

  getPieceRateAtDate(day) {
    if (this.pieceRates.length === 0) {
      return;
    }

    const [ firstPieceRate, ...restPieceRates ] = this.pieceRates;
    if (firstPieceRate.day > day) {
      return;
    }

    const { value } = restPieceRates.reduce((currentPieceRate, appointment) => {
      return appointment.day <= day ? appointment : currentPieceRate;
    }, firstPieceRate);

    return value;
  }
}
