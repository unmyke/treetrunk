import { idArg, arg } from 'nexus';
import { Award as AwardInput } from '../../inputs';

const addAwardArgs = {
  id: idArg({ required: true }),
  award: arg({ type: AwardInput, required: true }),
};
export default addAwardArgs;
