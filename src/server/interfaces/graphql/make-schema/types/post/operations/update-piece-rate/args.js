import { idArg, arg } from 'nexus';
import { Day as DayScalar } from '../../../../scalars';
import { PieceRate as PieceRateInput } from '../../inputs';

const updatePieceRateArgs = {
  id: idArg({ required: true }),
  day: arg({ type: DayScalar, required: true }),
  newPieceRate: arg({ type: PieceRateInput, required: true }),
};
export default updatePieceRateArgs;
