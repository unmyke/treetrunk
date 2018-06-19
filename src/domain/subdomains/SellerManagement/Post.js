import { BaseEntity } from '../../_lib';
import { makeError, errors } from '../../errors';
import { PostId, Day, Diary } from '../../commonTypes';
import { PieceRate } from './PieceRate';

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

      onBeforeSetPieceRates(lifecycle, pieceRates) {
        const newRecords = pieceRates.map(
          ({ value, day }) => new PieceRate({ value, day })
        );

        return this._pieceRates.setRecords({ newRecords });
      },

      onBeforeAddPieceRate(lifecycle, value, day = new Day()) {
        const record = new PieceRate({ value, day });

        return this._pieceRates.addRecord({ record });
      },

      onBeforeDeletePieceRate(lifecycle, value, day = new Day()) {
        const record = new PieceRate({ value, day });

        return this._pieceRates.deleteRecord({ record });
      },

      onBeforeUpdatePieceRate(lifecycle, value, day, newValue, newDay) {
        const record = new PieceRate({ value, day });
        const newRecord = new PieceRate({ value: newValue, day: newDay });

        return this._pieceRates.updateRecord({ record, newRecord });
      },
    },
  };

  constructor({ postId = new PostId(), name, state = 'active' }) {
    super(postId);
    this.name = name;
    this._pieceRates = new Diary({ RecordClass: PieceRate });

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
