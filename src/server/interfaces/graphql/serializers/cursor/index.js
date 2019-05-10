import errors from '@domain';
import separator from './cursor-separator';
import { decode, encode } from './base64';

const cursorSerializer = {
  parse: (cursor) => {
    const [type, id] = decode(cursor).split(separator);
    if (!id || !type) throw errors.gqlInvalidInput('Invalid cursor');

    return { type, id };
  },
  serialize: ({ type, id }) => encode(`${type}${separator}${id}`),
};

export default cursorSerializer;
