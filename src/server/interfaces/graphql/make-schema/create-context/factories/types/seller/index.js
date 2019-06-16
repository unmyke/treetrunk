import { objectType } from 'nexus';

import getAppointment from './appontment';
import getStateEnum from './state-enum';
import {
  getPostByPostId as getPostByPostIdResolever,
  getPostsByPostIds as getPostsByPostIdsResolever,
  getSeniorityTypeByMonths as getSeniorityTypeByMonthsResolever,
} from './resolvers';

const Seller = (ctx) => {
  const {
    types: { Post, SeniorityType },
    connections: { Post: PostConnection },
    interfaces: { Node, Timestamps },
    scalars: { Phone, Day, PositiveInt },
    args: { list: listArgs },
  } = ctx;

  const Appointment = getAppointment(ctx);
  const StateEnum = getStateEnum(ctx);
  const getPostByPostId = getPostByPostIdResolever(ctx);
  const getPostsByPostIds = getPostsByPostIdsResolever(ctx);
  const getSeniorityTypeByMonths = getSeniorityTypeByMonthsResolever(ctx);

  return objectType({
    name: 'Seller',
    definition(t) {
      t.implements(Node, Timestamps);
      t.string('firstName');
      t.string('middleName');
      t.string('lastName');
      t.field('phone', { type: Phone, nullable: true });
      t.id('postId', { nullable: true });
      t.list.id('postIds');
      t.field('post', {
        type: Post,
        nullable: true,
        resolve: getPostByPostId,
      });
      t.field('posts', {
        type: PostConnection,
        args: listArgs,
        resolve: getPostsByPostIds,
      });
      t.filed('seniority', { type: PositiveInt, nullable: true });
      t.field('seniorityType', {
        type: SeniorityType,
        nullable: true,
        resolve: getSeniorityTypeByMonths,
      });
      t.field('dismissDay', { type: Day, nullable: true });
      t.field('recruitDay', { type: Day, nullable: true });
      t.field('state', { type: StateEnum });
      t.list.field('appointments', { type: Appointment });
    },
  });
};

export default Seller;
