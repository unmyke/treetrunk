import { idArg, arg } from 'nexus';
import { Award as getAwardInput } from '../inputs';

const addAwardArgs = (ctx) => {
  const AwardInput = getAwardInput(ctx);
  return {
    id: idArg({ required: true }),
    award: arg({ type: AwardInput, required: true }),
  };
};
export default addAwardArgs;
