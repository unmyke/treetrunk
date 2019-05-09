import { identity } from '@common';

const idSerializer = {
  serialize: ({ value }) => value,
  parse: identity,
};

export default idSerializer;
