import { BaseEntity } from '../../_lib';
import { PostId, Day } from '../../commonTypes';
import { PieceRate } from './PieceRate';
import { PieceRates } from './PieceRates';
import { makeError, errors } from '../../errors';

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
          throw makeError({ name: errors.nothingToUpdate });
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

        return this._emitPieceRateOperation('_setRecords', {
          newRecords: pieceRates,
        });
      },

      // addPieceRate(value, day)
      onAddPieceRate(lifecycle, value, day = new Day()) {
        const pieceRate = new PieceRate({ value, day });

        return this._emitPieceRateOperation('_addRecord', {
          record: pieceRate,
        });
      },

      // deletePieceRate(value, day)
      onDeletePieceRate(lifecycle, value, day = new Day()) {
        const pieceRate = new PieceRate({ value, day });

        return this._emitPieceRateOperation('_deleteRecord', {
          record: pieceRate,
        });
      },

      // updatePieceRate(value, day, newValue, newDay)
      onUpdatePieceRate(lifecycle, value, day, newValue, newDay) {
        const pieceRate = new PieceRate({ value, day });
        const newPieceRate = new PieceRate({
          value: newValue,
          day: newDay,
        });

        return this._emitPieceRateOperation('_updateRecord', {
          record: pieceRate,
          newRecord: newPieceRate,
        });
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
    return this._pieceRates._records;
  }

  get pieceRate() {
    return this._pieceRates._getRecordValueAt();
  }

  get hasPieceRates() {
    return this._pieceRates._hasRecords;
  }

  getPieceRateAt(day = new Day()) {
    return this._pieceRates._getRecordValueAt(day);
  }

  hasPieceRatesAt(day = new Day()) {
    return this._pieceRates._hasRecordsAt(day);
  }

  getInstanceAt(day = new Day()) {
    const post = new Post(this);

    const pieceRates = this._pieceRates._getRecordsAt(day);
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

  _emitPieceRateOperation(operation, args) {
    const { done, error } = this._pieceRates[operation](args);

    if (!done) {
      const details = {};

      if (error.record) {
        details.pieceRate = error.record;
      }

      if (error.newRecords) {
        details.newPieceRates = error.newRecords;
      }

      if (error.newRecord) {
        details.newPieceRate = error.newRecord;
      }

      throw makeError(details);
    }

    return done;
  }
}
