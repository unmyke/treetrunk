import { Validator } from './Validator';

export class diaryClosedValidator extends Validator {
  check({ day }) {
    if (this.operatable.isClosedAt(day)) {
      throw this.errors.DIARY_CLOSED();
    }
  }
}
