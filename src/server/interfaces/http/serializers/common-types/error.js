import { Error as JSONAPIError } from 'jsonapi-serializer';

const errorSerializer = {
  serialize: ({ title, code, detail } = {}, status) =>
    new JSONAPIError({ status, code, detail, title }),
};

export default errorSerializer;
