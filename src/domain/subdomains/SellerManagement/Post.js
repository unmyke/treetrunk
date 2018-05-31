import {} from 'javascript-state-machine';

import { BaseEntity } from '../../_lib';
import { PostId, Day } from '../../commonTypes';
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
    ],
    methods: {
      // update({ name })
      onBeforeUpdate(lifecycle, { name }) {
        if (name === this.name) {
          throw this.constructor.errorFactory.createNothingToUpdate(
            this,
            `Post already has name "${name}"`
          );
        }
      },
      onUpdate(lifecycle, { name }) {
        this.name = name;
      },

      //setPieceRates([ { value, day } ])
      onSetPieceRates(lifecycle, pieceRates) {
        this._pieceRates = pieceRates.map(
          ({ value, day }) => new PieceRate({ value, day })
        );
      },

      //addPieceRates(value, day = new Day())
      onBeforeAddPieceRate({ transition, from, to }, value, day = new Day()) {
        const pieceRate = new PieceRate({ value, day });

        if (this._isPieceRateExistsAt(pieceRate.day)) {
          throw this.constructor.errorFactory.createAlreadyExists(
            pieceRate,
            `Piece rate at ${pieceRate.day.format('DD.MM.YYYY')} already exists`
          );
        }

        const prevPieceRate = this._getPrevPieceRateAt(pieceRate.day.prev());
        if (
          prevPieceRate !== undefined &&
          pieceRate.value === prevPieceRate.value
        ) {
          throw this.constructor.errorFactory.createAlreadyExists(
            pieceRate,
            `Piece rate value at ${prevPieceRate.day.format(
              'DD.MM.YYYY'
            )} already equals "${prevPieceRate.value}"`
          );
        }

        const nextPieceRate = this._getNextPieceRateAt(pieceRate.day.next());
        if (
          nextPieceRate !== undefined &&
          pieceRate.value === nextPieceRate.value
        ) {
          throw this.constructor.errorFactory.createAlreadyExists(
            pieceRate,
            `Piece rate value at ${nextPieceRate.day.format(
              'DD.MM.YYYY'
            )} already equals "${nextPieceRate.value}"`
          );
        }
      },

      onAddPieceRate({ transition, from, to }, value, day = new Day()) {
        const pieceRate = new PieceRate({ value, day });
        this._pieceRates = [...this._pieceRates, pieceRate].sort(
          this._getDayComparator
        );
      },

      // deletePieceRate({ value, day })
      onBeforeDeletePieceRate(
        { transition, from, to },
        value,
        day = new Day()
      ) {
        const pieceRateToDelete = new PieceRate({ value, day });

        const persistedPieceRate = this._getPieceRateAt(day);

        if (!pieceRateToDelete.equals(persistedPieceRate)) {
          throw this.constructor.errorFactory.createNotFound(
            pieceRateToDelete,
            `Piece rate with value ${value} at ${day.format(
              'DD.MM.YYYY'
            )} not found`
          );
        }

        const prevPieceRate = this._getPrevPieceRateAt(day.prev());
        const nextPieceRate = this._getNextPieceRateAt(day.next());

        if (
          prevPieceRate !== undefined &&
          nextPieceRate !== undefined &&
          prevPieceRate.value === nextPieceRate.value
        ) {
          throw this.constructor.errorFactory.createNotAllowed(
            pieceRateToDelete,
            `Piece rate with value ${value} at ${day.format(
              'DD.MM.YYYY'
            )} not allowed to delete: piece rate at ${prevPieceRate.day.format(
              'DD.MM.YYYY'
            )} equals piece rate at ${nextPieceRate.day.format('DD.MM.YYYY')}`
          );
        }
      },
      onDeletePieceRate({ transition, from, to }, value, day = new Day()) {
        const pieceRateToDelete = new PieceRate({ value, day });

        const filteredPieceRates = this._pieceRates.filter(
          (pieceRate) => !pieceRate.equals(pieceRateToDelete)
        );
        this._pieceRates = filteredPieceRates;
      },
    },
  };

  constructor({ postId = new PostId(), name, state = 'active' }) {
    super(postId);
    this.name = name;
    this._pieceRates = [];

    this.setState(state);
  }

  get pieceRates() {
    return this._getPieceRatesAt();
  }

  get pieceRate() {
    const pieceRate = this._getPrevPieceRateAt();
    return pieceRate === undefined ? undefined : pieceRate.value;
  }

  get hasPieceRates() {
    return this.hasPieceRateAt();
  }

  hasPieceRateAt(day = new Day()) {
    const [firstPieceRate] = this._getPieceRatesAt(day);
    return !!firstPieceRate && firstPieceRate.day <= day;
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
    return this._pieceRates
      .sort(this._getDayComparator())
      .filter(({ day: currentDay }) => currentDay <= day);
  }

  _getPrevPieceRateAt(day = new Day()) {
    if (!this.hasPieceRateAt(day)) {
      return;
    }

    const pieceRates = this._getPieceRatesAt(day);
    return pieceRates[pieceRates.length - 1];
  }

  _getNextPieceRateAt(day = new Day()) {
    const [lastPieceRate, ...restPieceRates] = this._pieceRates.sort(
      this._getDayComparator('desc')
    );

    if (lastPieceRate === undefined || lastPieceRate.day < day) {
      return undefined;
    }

    const pieceRate = restPieceRates.reduce((pieceRate, currentPieceRate) => {
      return currentPieceRate.day >= day ? currentPieceRate : pieceRate;
    }, lastPieceRate);

    return pieceRate;
  }

  _getPieceRateAt(day = new Day()) {
    const index = this._pieceRates.findIndex(({ day: currentDay }) =>
      day.equals(currentDay)
    );

    return this._pieceRates[index];
  }

  _isPieceRateExistsAt(day = new Day()) {
    return !!this._getPieceRateAt(day);
  }
}

// editPieceRate(valueToEdit, dayToEdit, value, day) {
//   const pieceRateToEdit = new PieceRate({
//     value: valueToEdit,
//     day: dayToEdit,
//   });
//   const pieceRate = new PieceRate({ value, day });

//   if (pieceRate.equals(pieceRateToEdit)) {
//     throw this.constructor.errorFactory.createNothingToUpdate(
//       pieceRateToEdit,
//       `Updated piece rate at ${day.format(
//         'DD.MM.YYYY'
//       )} for post "Флорист" already equlas ${value}%`
//     );
//   }

//   this.addPieceRate(value, day);
//   this.deletePieceRate(valueToEdit, dayToEdit);
// }
