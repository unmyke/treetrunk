import { idArg, arg } from 'nexus';

const deleteAwardArgs = (ctx) => {
  const {
    scalars: { Day },
  } = ctx;
  return {
    id: idArg({ required: true }),
    day: arg({ type: Day, required: true }),
  };
};
export default deleteAwardArgs;
