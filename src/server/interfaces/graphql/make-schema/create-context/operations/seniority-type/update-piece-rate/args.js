import { idArg, arg } from 'nexus';
import { Day as DayScalar } from '../../../../scalars';
import { Award as AwardInput } from '../../inputs';

const updateAwardArgs = {
  id: idArg({ required: true }),
  day: arg({ type: DayScalar, required: true }),
  newAward: arg({ type: AwardInput, required: true }),
};
export default updateAwardArgs;
