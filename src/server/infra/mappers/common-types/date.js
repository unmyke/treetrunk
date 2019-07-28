import { identity } from '@common';

export default () => {
  const toDatabase = identity;
  const toEntity = identity;

  Object.freeze({ toDatabase, toEntity });
};
