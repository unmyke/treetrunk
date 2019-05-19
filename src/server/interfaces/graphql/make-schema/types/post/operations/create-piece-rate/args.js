import { idArg, arg } from 'nexus';
import { PieceRate as PieceRateInput } from '../../inputs';

const addPieceRateArgs = {
  id: idArg({ required: true }),
  pieceRate: arg({ type: PieceRateInput, required: true }),
};
export default addPieceRateArgs;
