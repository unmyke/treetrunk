import { BaseEntity } from "../_lib/BaseClasses";
import { Day } from "../_lib/ValueObjects";
import { PieceRate } from "./PieceRate";
import { PostId } from "./PostId";

export class Post extends BaseEntity {
  constructor({ postId = new PostId(), name, pieceRates = [] }) {
    super(postId);
    this.name = name;
    this.pieceRates = pieceRates;
  }

  addPieceRate(value, day) {
    const previuosPieceRate = this.getPieceRateAt(day);
    const pieceRate = new PieceRate({ value, day });
    if (previuosPieceRate.equals(pieceRate)) {
      const error = new Error("Validation Error");
      error.details = ["Post already have this pieceRate"];
      throw error;
    }
    this.pieceRates = [...this.pieceRates, pieceRate].sort(
      (a, b) => a.day > b.day
    );
  }

  getPieceRateAt(day) {
    if (!this.hasPieceRate()) {
      return;
    }

    const [firstPieceRate, ...restPieceRates] = this.pieceRates;
    if (firstPieceRate.day > day) {
      return;
    }

    const { value } = restPieceRates.reduce((currentPieceRate, appointment) => {
      return appointment.day <= day ? appointment : currentPieceRate;
    }, firstPieceRate);

    return value;
  }

  deletePieceRate(value, day) {
    if (!this.hasPieceRate()) {
      return;
    }

    const pieceRateToDelete = new PieceRate({ value, day });
    const filteredPieceRates = this.pieceRates.filter(
      pieceRate => !pieceRate.equals(pieceRateToDelete)
    );
    if (this.pieceRates.length === filteredPieceRates.length) {
      return;
    }

    this.pieceRates = filteredPieceRates;
  }

  hasPieceRate() {
    return this.pieceRates.length !== 0;
  }
}
