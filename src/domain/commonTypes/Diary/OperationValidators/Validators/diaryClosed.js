import { errors } from '../../../../errors';

export function diaryClosed(day) {
  if (this.operatable.isClosedAt(day)) {
    throw errors.diaryClosed();
  }
}
