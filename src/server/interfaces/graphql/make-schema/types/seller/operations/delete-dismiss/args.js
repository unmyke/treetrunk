import { idArg } from 'nexus';

const deleteDismissArgs = {
  id: idArg({ required: true }),
};
export default deleteDismissArgs;
