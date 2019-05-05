import { queryField, idArg } from 'nexus';

import { Post } from '../types';
import { Post as postResolver } from '../resolvers';

const postQueryField = queryField('post', {
  type: Post,
  args: { id: idArg({ required: true }) },
  resolve: postResolver,
});

export default postQueryField;
