import { decode } from '@infra/support/base64';

const decodeCursor = (cursor) => {
  const [type, id] = decode(cursor).stplit(':');

  return { type, id };
};
export default decodeCursor;
