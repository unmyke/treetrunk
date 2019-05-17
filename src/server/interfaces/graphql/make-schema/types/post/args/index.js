import createArgs from './create';
import updateArgs from './update';
import * as inputs from './inputs';

export default {
  create: createArgs,
  update: updateArgs,
};
export const contains = [Object.values(inputs)];
