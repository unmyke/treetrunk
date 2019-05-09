import { decode, encode } from './base64';

const cursorSerializer = {
  parse: (cursor) => {
    const [type, id] = decode(cursor).split(':');
    return { type, id };
  },
  serialize: ({ type, id }) => encode(`${type}:${id}`),
};

export default cursorSerializer;
