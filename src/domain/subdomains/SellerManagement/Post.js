import { BaseEntity } from '../../_lib';
import { errors } from '../../errors';
import { PostId, Day, Diary } from '../../commonTypes';

const diaryErrorMessages = {
  RECORD_ALREADY_EXISTS: errors.pieceRateAlreadyExists(),
  RECORD_DUPLICATE: errors.pieceRateDuplicate(),
  RECORD_NOT_FOUND: errors.pieceRateNotFound(),
  RECORD_HAS_EQUAL_NEIGHBOURS: errors.pieceRateHasEqualNeighbours(),
  RECORD_HAS_LIMITED_SCOPE: errors.pieceRateHasLimitedScope(),
  NEW_RECORD_ALREADY_EXISTS: errors.newPieceRateAlreadyExists(),
  NEW_RECORD_DUPLICATE: errors.newPieceRateDuplicate(),
};

const dispatchDiaryError = (originalError) => {
  const error = errors[diaryErrorMessages[originalError.message]];
  error.originalError = originalError;

  return error;
};

const diaryOperationRunner = (operation) => {
  try {
    return operation;
  } catch (error) {
    throw dispatchDiaryError(error);
  }
};

const states = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

const transitions = {
  UPDATE: 'update',
  ADD_PIECE_RATE: 'addPieceRate',
  DELETE_PIECE_RATE_AT: 'deletePieceRateAt',
  UPDATE_PIECE_RATE_TO: 'updatePieceRateTo',
  ACTIVATE: 'activate',
  INACTIVATE: 'inactivate',
};

export class Post extends BaseEntity {
  static restore({ postId, name, pieceRates, state }) {
    const post = new Post({ postId, name, state });
    post._pieceRates = Diary.restore(pieceRates);
    post.setState(state);

    return post;
  }

  static instanceAt({ name, pieceRates, state }, day = new Day()) {
    const post = new Post({ name, state });
    post._pieceRates = Diary.instanceAt(pieceRates, day);
    post.setState(state);

    return post;
  }

  static fsm = {
    init: states.ACTIVE,
    transitions: [
      { name: transitions.UPDATE, from: states.ACTIVE, to: states.ACTIVE },
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
        to: states.INACTIVE,
      },
      { name: transitions.ACTIVATE, from: states.INACTIVE, to: states.ACTIVE },
    ],

    methods: {
      // update({ name })
      onUpdate(lifecycle, { name }) {
        this.name = name;
      },

      onBeforeAddPieceRate(lifecycle, value, day = new Day()) {
        return diaryOperationRunner(() => this._pieceRates.add({ value, day }));
      },

      onBeforeDeletePieceRate(lifecycle, day = new Day()) {
        return diaryOperationRunner(() => this._pieceRates.deleteAt(day));
      },

      onBeforeUpdatePieceRate(lifecycle, day, newValue, newDay) {
        return diaryOperationRunner(() =>
          this._pieceRates.updateTo(day, newValue, newDay)
        );
      },
    },
  };

  constructor({ postId = new PostId(), name, state = states.ACTIVE }) {
    super(postId);
    this.name = name;
    this._pieceRates = new Diary();

    this.setState(state);
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
