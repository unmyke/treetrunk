import { PostId, Day } from '../../commonTypes';
import { PieceRates } from './PieceRates';
import { makeError, errors } from '../../errors';
import { BaseEntity } from '../../_lib';

export class Post extends BaseEntity {
  static fsm = {
    init: 'active',
    transitions: [
      { name: 'inactivate', from: 'active', to: 'inactive' },
      { name: 'activate', from: 'inactive', to: 'active' },
      { name: 'update', from: 'active', to: 'active' },
      { name: 'setPieceRates', from: 'active', to: 'active' },
      { name: 'addPieceRate', from: 'active', to: 'active' },
      { name: 'deletePieceRate', from: 'active', to: 'active' },
      { name: 'updatePieceRate', from: 'active', to: 'active' },
      { name: 'setState', from: ['active', 'inactive'], to: (state) => state },
    ],

    methods: {
      onActive() {
        this.pieceRateOperationResult = { done: true };
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

      onSetPieceRates(lifecycle, pieceRateEntries) {
        return this._pieceRates.setPieceRates(pieceRateEntries);
      },

      onAddPieceRate(lifecycle, value, day = new Day()) {
        return this._pieceRates.addPieceRate(value, day);
      },

      onDeletePieceRate(lifecycle, value, day = new Day()) {
        return this._pieceRates.deletePieceRate(value, day);
      },

      onUpdatePieceRate(lifecycle, value, day, newValue, newDay) {
        return this._pieceRates.updatePieceRate(value, day, newValue, newDay);
      },
    },
  };

  constructor({ postId = new PostId(), name, state = 'active' }) {
    super(postId);
    this.name = name;
    this._pieceRates = new PieceRates();

    this.setState(state);
  }

  get pieceRates() {
    return this._pieceRates.pieceRates;
  }

  get pieceRate() {
    return this._pieceRates.pieceRateValue;
  }

  get hasPieceRates() {
    return this._pieceRates.hasPieceRates;
  }

  getPieceRateAt(day = new Day()) {
    return this._pieceRates.getPieceRateValueAt(day);
  }

  hasPieceRatesAt(day = new Day()) {
    return this._pieceRates.hasPieceRatesAt(day);
  }

  getInstanceAt(day = new Day()) {
    const post = new Post(this);

    const pieceRates = this._pieceRates.getPieceRatesAt(day);
    post.setPieceRates(pieceRates);

    return post;
  }

  toJSON() {
    return {
      postId: this.postId.toJSON(),
      name: this.name,
      pieceRate: this.pieceRate,
      pieceRates: this._pieceRates.map((pieceRate) => pieceRate.toJSON()),
      state: this.state,
    };
  }
}
