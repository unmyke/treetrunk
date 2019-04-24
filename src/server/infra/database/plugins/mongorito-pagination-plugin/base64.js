import { errors } from '@domain/errors';

export const encode = (obj) =>
  Buffer.from(JSON.stringify(obj)).toString('base64');

export const decode = (str) => {
  try {
    return JSON.parse(Buffer.from(str, 'base64').toString());
  } catch (error) {
    throw errors.invalidQuery('Passed invalid query');
  }
};
