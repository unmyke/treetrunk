import {} from 'javascript-state-machine';

import { BaseEntity } from '../../_lib';
import { PostId, Day } from '../../commonTypes';
import { PieceRate } from './PieceRate';
import { PieceRateCollection } from './PieceRateCollection';

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
      { name: 'setState', from: ['active', 'inactive'], to: (state) => state },
    ],
    methods: {
      onActive() {
        this.pieceRateOperationResult = { done: true };
      },

      // update({ name })
      onBeforeUpdate(lifecycle, { name }) {
        if (name === this.name) {
          throw this.constructor.errorFactory.createNothingToUpdate(
            this,
            `Post in ${this.state} state already has name "${name}"`
          );
        }
      },

      onUpdate(lifecycle, { name }) {
        this.name = name;
      },

      onSetPieceRates(lifecycle, pieceRateEntries) {
        const pieceRates = pieceRateEntries.map(
          ({ value, day }) => new PieceRate({ value, day })
        );

        return this._emitPieceRateOperation('setItems', pieceRates);
      },

      onAddPieceRate(lifecycle, value, day = new Day()) {
        const pieceRate = new PieceRate({ value, day });

        return this._emitPieceRateOperation('addItem', pieceRate);
      },

      onDeletePieceRate(lifecycle, value, day = new Day()) {
        const pieceRate = new PieceRate({ value, day });

        return this._emitPieceRateOperation('deleteItem', pieceRate);
      },
    },
  };

  constructor({ postId = new PostId(), name, state = 'active' }) {
    super(postId);
    this.name = name;
    this._pieceRates = new PieceRateCollection();

    this.setState(state);
  }

  get pieceRates() {
    return this._pieceRates.collection;
  }

  get pieceRate() {
    return this._pieceRates.itemValue;
  }

  get hasPieceRates() {
    return this._pieceRates.hasCollection;
  }

  hasPieceRateAt(day = new Day()) {
    return this._pieceRates.hasItemAt(day);
  }

  getInstanceAt(day = new Day()) {
    const post = new Post(this);

    const pieceRates = this._getPieceRatesAt(day);
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

  // private

  _getPieceRatesAt(day = new Day()) {
    return this._pieceRates.getCollectionAt(day);
  }

  _getPrevPieceRateAt(day = new Day()) {
    return this._pieceRates.getPrevItemAt(day);
  }

  _getNextPieceRateAt(day = new Day()) {
    return this._pieceRates.getNextItemAt(day);
  }

  _getPieceRateAt(day = new Day()) {
    return this._pieceRates.getItemAt(day);
  }

  _isPieceRateExistsAt(day = new Day()) {
    return this._pieceRates.isItemExistsAt(day);
  }

  _generateError(entity, details) {
    throw this.constructor.errorFactory.createNotAllowed(entity, details);
  }

  _emitPieceRateOperation(operation, args) {
    const { done, error } = this._pieceRates[operation](args);

    if (!done) {
      this._generateError(args, ...error);
    }
    return done;
  }
}
