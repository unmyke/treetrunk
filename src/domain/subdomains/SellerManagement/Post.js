import {} from 'javascript-state-machine';

import { BaseEntity } from '../../_lib';
import { PostId, Day, BaseDiary } from '../../commonTypes';
import { PieceRate } from './PieceRate';

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
      { name: 'editPieceRate', from: 'active', to: 'active' },
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

      // setPieceRates([{ value, day }])
      onSetPieceRates(lifecycle, pieceRateEntries) {
        const pieceRates = pieceRateEntries.map(
          ({ value, day }) => new PieceRate({ value, day })
        );

        return this._emitPieceRateOperation('setItems', pieceRates);
      },

      // addPieceRate(value, day)
      onAddPieceRate(lifecycle, value, day = new Day()) {
        const pieceRate = new PieceRate({ value, day });

        return this._emitPieceRateOperation('addItem', pieceRate);
      },

      // deletePieceRate(value, day)
      onDeletePieceRate(lifecycle, value, day = new Day()) {
        const pieceRate = new PieceRate({ value, day });

        return this._emitPieceRateOperation('deleteItem', pieceRate);
      },

      // editPieceRate(value, day, newValue, newDay)
      onEditPieceRate(lifecycle, value, day, newValue, newDay) {
        const pieceRate = new PieceRate({ value, day });
        const newPieceRate = new PieceRate({
          value: newValue,
          day: newDay,
        });

        return this._emitPieceRateOperation(
          'editItem',
          pieceRate,
          newPieceRate
        );
      },
    },
  };

  constructor({ postId = new PostId(), name, state = 'active' }) {
    super(postId);
    this.name = name;
    this._pieceRates = new BaseDiary();

    this.setState(state);
  }

  get pieceRates() {
    return this._pieceRates.items;
  }

  get pieceRate() {
    return this._pieceRates.getItemValueAt();
  }

  get hasPieceRates() {
    return this._pieceRates.hasItems;
  }

  getPieceRateAt(day = new Day()) {
    return this._pieceRates.getItemValueAt(day);
  }

  hasPieceRatesAt(day = new Day()) {
    return this._pieceRates.hasItemsAt(day);
  }

  getInstanceAt(day = new Day()) {
    const post = new Post(this);

    const pieceRates = this._pieceRates.getItemsAt(day);
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

  _generateError(entity, details) {
    throw this.constructor.errorFactory.createNotAllowed(entity, details);
  }

  _emitPieceRateOperation(operation, ...args) {
    const { done, error } = this._pieceRates[operation](...args);

    if (!done) {
      this._generateError(this, ...error);
    }
    return done;
  }
}
