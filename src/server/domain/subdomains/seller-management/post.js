import { getSyncOperationRunner } from 'src/infra/support/operation-runner';

import { BaseEntity } from '../../_lib';
import { errors } from '../../errors';
import { Post as states } from '../../states';
import { Day, Diary } from '../../common-types';
import { loop } from 'src/domain/_lib/base-methods';
import { SellerId } from 'dist/domain/common-types/seller-id/seller-id';

const diaryErrorMessageMapper = {
  RECORD_ALREADY_EXISTS: errors.pieceRateAlreadyExists(),
  RECORD_DUPLICATE: errors.pieceRateDuplicate(),
  RECORD_NOT_FOUND: errors.pieceRateNotFound(),
  RECORD_HAS_EQUAL_NEIGHBOURS: errors.pieceRateHasEqualNeighbours(),
  RECORD_HAS_LIMITED_SCOPE: errors.pieceRateHasLimitedScope(),
  NEW_RECORD_ALREADY_EXISTS: errors.newPieceRateAlreadyExists(),
  NEW_RECORD_DUPLICATE: errors.newPieceRateDuplicate(),
};
const diaryOperationRunner = getSyncOperationRunner(diaryErrorMessageMapper);

const transitions = {
  UPDATE: 'update',
  ADD_PIECE_RATE: 'addPieceRate',
  DELETE_PIECE_RATE_AT: 'deletePieceRateAt',
  UPDATE_PIECE_RATE_TO: 'updatePieceRateTo',
  ACTIVATE: 'activate',
  INACTIVATE: 'inactivate',
};

export class Post extends BaseEntity {
  static restore({ name, pieceRates, state, ...props }) {
    const post = new Post({ name, state, ...props });
    post._pieceRates = Diary.restore(pieceRates);
    post.setState(state);

    return post;
  }

  static instanceAt({ name, _pieceRates, state, ...props }, day = new Day()) {
    const post = new Post({ name, ...props });
    post._pieceRates = Diary.instanceAt(_pieceRates, day);
    post.setState(state);

    return post;
  }

  static fsm = {
    init: states.ACTIVE,
    transitions: [
      { name: transitions.UPDATE, from: '*', to: loop },
      {
        name: transitions.ADD_PIECE_RATE,
        from: states.ACTIVE,
        to: states.ACTIVE,
      },
      {
        name: transitions.DELETE_PIECE_RATE_AT,
        from: states.ACTIVE,
        to: states.ACTIVE,
      },
      {
        name: transitions.UPDATE_PIECE_RATE_TO,
        from: states.ACTIVE,
        to: states.ACTIVE,
      },
      {
        name: transitions.INACTIVATE,
        from: states.ACTIVE,
        to: states.DELETED,
      },
      { name: transitions.ACTIVATE, from: states.DELETED, to: states.ACTIVE },
    ],

    methods: {
      // update({ name })
      onBeforeUpdate(lifecycle, { name }) {
        this.name = name;
      },

      onBeforeAddPieceRate(lifecycle, value, day = new Day()) {
        return diaryOperationRunner(() => this._pieceRates.add(value, day));
      },

      onBeforeDeletePieceRateAt(lifecycle, day = new Day()) {
        return diaryOperationRunner(() => this._pieceRates.deleteAt(day));
      },

      onBeforeUpdatePieceRateTo(lifecycle, day, newValue, newDay) {
        return diaryOperationRunner(() =>
          this._pieceRates.updateTo(day, newValue, newDay)
        );
      },
    },
  };

  constructor({ sellerId = new PostId(), name, ...props }) {
    super({ id: postId, ...props });
    this.name = name;
    this._pieceRates = new Diary();
  }

  get pieceRates() {
    return this._pieceRates.records;
  }

  get pieceRate() {
    return this._pieceRates.recordValue;
  }

  get hasPieceRates() {
    return this._pieceRates.length !== 0;
  }
}
