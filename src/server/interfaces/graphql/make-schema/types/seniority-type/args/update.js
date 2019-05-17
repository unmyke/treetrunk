import { arg, idArg } from 'nexus';
import { SeniorityType as SeniorityTypeInput } from '../inputs';

const updateArgs = {
  id: idArg({ required: true }),
  post: arg({ type: SeniorityTypeInput, required: true }),
};
export default updateArgs;
