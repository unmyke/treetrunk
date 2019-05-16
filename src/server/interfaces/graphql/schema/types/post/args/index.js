import Create from './create';
import Update from './update';
import Delete from './delete';
import * as inputs from './inputs';

export default {
  create: Create,
  update: Update,
  delete: Delete,
};
export const contains = [Object.values(inputs)];
