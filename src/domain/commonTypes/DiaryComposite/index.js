import { Diary } from '../Diary';
import { makeError, errors } from '../../errors';

export class DiaryComposite {
  constructor({ closeValue, RecordClass, mapper }) {
    this._diary = new Diary({ closeValue, RecordClass });
    this.mapper = mapper;
  }

  map(fn) {
    return this._diary.map(fn);
  }

  filter(fn) {
    return this._diary.map(fn);
  }

  reduce(fn) {
    return this._diary.map(fn);
  }

  _emit(operation, args) {
    const { done, error } = this._diary[operation](args);

    if (!done) {
      const details = {};

      const argNames = Object.keys(args);

      argNames.forEach((argName) => {
        if (error[argName] !== undefined && error[argName].length !== 0) {
          console.log(this.mapper);
          details[this.mapper[argName]] = error[argName];
        }
      });

      throw makeError(details);
    }

    return done;
  }
}
