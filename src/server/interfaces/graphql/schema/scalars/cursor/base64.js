import { errors } from '@domain';

export const encode = (obj) =>
  Buffer.from(JSON.stringify(obj)).toString('base64');

export const decode = (str) => {
  try {
    return JSON.parse(Buffer.from(str, 'base64').toString());
  } catch (error) {
    throw errors.gqlInvalidInput('Invalid cursor');
  }
};
