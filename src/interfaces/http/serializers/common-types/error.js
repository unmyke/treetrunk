import { Error as JSONAPIError } from 'jsonapi-serializer';

export const errorSerializer = {
  serialize: ({ title, code, detail } = {}, status) =>
    new JSONAPIError({ status, code, detail, title }),
};
