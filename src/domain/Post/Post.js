import { BaseEntity } from '../lib/BaseClasses';
import { PieceRate } from './PieceRate';
import { PostId } from './PostId';
import { convertDate } from 'src/infra/support/dateHelpers';

export class Post extends BaseEntity {
  constructor({ id = new PostId(), name, pieceRates = [] }) {
    super(id);
    this.name = name;
    this.pieceRates = pieceRates;
  }

  addPieceRate(value, date) {
    const pieceRate = new PieceRate({ value, date });
    this.pieceRates = [ ...this.pieceRates, pieceRate ].sort((a, b) => a.date > b.date);
  }

  getPieceRateAtDate(rawDate) {
    const date = convertDate(rawDate);
    if (this.pieceRates.length === 0) {
      return;
    }

    const [ firstPieceRate, ...restPieceRates ] = this.pieceRates;
    if (firstPieceRate.date > date) {
      return;
    }

    const { value } = restPieceRates.reduce((currentPieceRate, appointment) => {
      return appointment.date <= date ? appointment : currentPieceRate;
    }, firstPieceRate);

    return value;
  }
}
