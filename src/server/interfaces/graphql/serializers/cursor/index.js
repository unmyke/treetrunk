import { errors } from '@domain';
import separator from './cursor-separator';
import { decode, encode } from './base64';

const cursorSerializer = {
  parse: (cursor) => {
    const [typeName, id] = decode(cursor).split(separator);
    if (!id || !typeName) throw errors.gqlInvalidInput('Invalid cursor');

    return { typeName, id };
  },
  serialize: ({ typeName, id }) => {
    return encode(`${typeName}${separator}${id}`);
  },
};

export default cursorSerializer;
