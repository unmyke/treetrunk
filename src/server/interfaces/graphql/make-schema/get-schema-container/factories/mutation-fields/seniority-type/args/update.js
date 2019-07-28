import { arg, idArg } from 'nexus';
import { SeniorityType as SeniorityTypeInput } from '../inputs';

const updateArgs = {
  id: idArg({ required: true }),
  seniorityType: arg({ type: SeniorityTypeInput, required: true }),
};
export default updateArgs;
