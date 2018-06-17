import { BaseEntity } from '../../_lib';
import { makeError, errors } from '../../errors';
import { PostId, Day } from '../../commonTypes';
import { PieceRates } from './PieceRates';

export class Post extends BaseEntity {
  static states = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
  };

  static fsm = {
    init: 'active',
    transitions: [
      {
        name: 'inactivate',
        from: Post.states.ACTIVE,
        to: Post.states.INACTIVE,
      },
      { name: 'activate', from: Post.states.INACTIVE, to: Post.states.ACTIVE },
      { name: 'update', from: Post.states.ACTIVE, to: Post.states.ACTIVE },
      {
        name: 'setPieceRates',
        from: Post.states.ACTIVE,
        to: Post.states.ACTIVE,
      },
      {
        name: 'addPieceRate',
        from: Post.states.ACTIVE,
        to: Post.states.ACTIVE,
      },
      {
        name: 'deletePieceRate',
        from: Post.states.ACTIVE,
        to: Post.states.ACTIVE,
      },
      {
        name: 'updatePieceRate',
        from: Post.states.ACTIVE,
        to: Post.states.ACTIVE,
      },
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
        return this._pieceRates.setRecords(pieceRateEntries);
      },

      onAddPieceRate(lifecycle, value, day = new Day()) {
        return this._pieceRates.addRecord(value, day);
      },

      onDeletePieceRate(lifecycle, value, day = new Day()) {
        return this._pieceRates.deleteRecord(value, day);
      },

      onUpdatePieceRate(lifecycle, value, day, newValue, newDay) {
        return this._pieceRates.updateRecord(value, day, newValue, newDay);
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
    return this._pieceRates.records;
  }

  get pieceRate() {
    return this._pieceRates.recordValue;
  }

  get hasPieceRates() {
    return this._pieceRates.hasRecords;
  }

  getPieceRateAt(day = new Day()) {
    return this._pieceRates.getRecordValueAt(day);
  }

  hasPieceRatesAt(day = new Day()) {
    return this._pieceRates.hasRecordsAt(day);
  }

  getInstanceAt(day = new Day()) {
    const post = new Post(this);

    const pieceRates = this._pieceRates.getRecordsAt(day);
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
