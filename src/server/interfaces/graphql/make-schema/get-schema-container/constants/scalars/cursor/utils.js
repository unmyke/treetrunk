import { errors } from '@domain';
import separator from './cursor-separator';
import { decode, encode } from '@infra/support/base64';

export const parse = (cursor) => {
  const [typeName, id] = decode(cursor).split(separator);
  if (!id || !typeName) throw errors.gqlInvalidInput('Invalid cursor');

  return { typeName, id };
};

export const serialize = ({ typeName, id }) =>
  encode(`${typeName}${separator}${id}`);
