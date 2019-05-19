import { idArg, arg } from 'nexus';
import { Day as DayScalar } from '../../../../scalars';

const deletePieceRateArgs = {
  id: idArg({ required: true }),
  day: arg({ type: DayScalar, required: true }),
};
export default deletePieceRateArgs;
