import { arg, idArg } from 'nexus';
import { Post as PostInput } from './inputs';

const updateArgs = {
  id: idArg({ required: true }),
  post: arg({ type: PostInput, required: true }),
};
export default updateArgs;
