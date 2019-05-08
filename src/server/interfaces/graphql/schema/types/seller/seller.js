import { objectType } from 'nexus';

import Appointment from './appontment';
import StateEnum from './state-enum';

import Post from '../post';
import SeniorityType from '../seniority-type';
import { Node, Timestamps } from '../../interfaces';
import connections from '../../connections';

import {
  getSeller,
  getPost,
  getPostsByPostIds,
  getSeniorityTypeByMonths,
} from '../../resolvers';

const Seller = objectType({
  name: 'Seller',
  resolve: getSeller,
  definition(t) {
    t.implements(Node, Timestamps);
    t.string('firstName');
    t.string('middleName');
    t.string('lastName');
    t.phone('phone', { nullable: true });
    t.field('post', {
      type: Post,
      nullable: true,
      resolve: ({ postId }, _, ctx) => getPost(undefined, { id: postId }, ctx),
    });
    t.field('posts', {
      type: connections.Post,
      nullable: true,
      resolve: getPostsByPostIds,
    });
    t.field('seniorityType', {
      type: SeniorityType,
      nullable: true,
      resolve: getSeniorityTypeByMonths,
    });
    t.day('dismissAt', { nullable: true });
    t.day('recruitedAt', { nullable: true });
    t.field('state', { type: StateEnum });
    t.list.field('appointments', { type: Appointment });
  },
});

export default Seller;
