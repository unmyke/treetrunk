import { idArg, arg } from 'nexus';
import { Day as DayScalar } from '../../../../scalars';

const dismissArgs = {
  id: idArg({ required: true }),
  day: arg({ type: DayScalar, required: false }),
};
export default dismissArgs;
