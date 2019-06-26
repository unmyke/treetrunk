import { idArg, arg } from 'nexus';
import { Award as getAwardInput } from '../inputs';

const updateAwardArgs = (ctx) => {
  const {
    scalars: { Day: DayScalar },
  } = ctx;
  const {
    utils: { getSchemaItem },
  } = ctx;

  const AwardInput = getSchemaItem(getAwardInput);

  return {
    id: idArg({ required: true }),
    day: arg({ type: DayScalar, required: true }),
    newAward: arg({ type: AwardInput, required: true }),
  };
};
export default updateAwardArgs;
