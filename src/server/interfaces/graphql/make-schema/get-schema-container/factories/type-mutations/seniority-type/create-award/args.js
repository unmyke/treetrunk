import { idArg, arg } from 'nexus';
import { Award as getAwardInput } from '../inputs';

const addAwardArgs = (ctx) => {
  const {
    utils: { getSchemaItem },
  } = ctx;
  const AwardInput = getSchemaItem(getAwardInput);
  return {
    id: idArg({ required: true }),
    award: arg({ type: AwardInput, required: true }),
  };
};
export default addAwardArgs;
