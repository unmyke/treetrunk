import { idArg, arg } from 'nexus';

const updateAwardArgs = (ctx) => {
  const {
    scalars: { Day: DayScalar },
    inputs: { Award: AwardInput },
  } = ctx;
  return {
    id: idArg({ required: true }),
    day: arg({ type: DayScalar, required: true }),
    newAward: arg({ type: AwardInput, required: true }),
  };
};
export default updateAwardArgs;
