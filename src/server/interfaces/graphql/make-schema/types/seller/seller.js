import { objectType } from 'nexus';

import Appointment from './appontment';
import StateEnum from './state-enum';
import {
  getPostByPostId,
  getPostsByPostIds,
  getSeniorityTypeByMonths,
} from './resolvers';

import Post, { connection as PostConnection } from '../post';
import SeniorityType from '../seniority-type';
import interfaces from '../../interfaces';
import args from '../../args';

const { Node, Timestamps } = interfaces;
const { getList: getListArgs } = args;

const Seller = objectType({
  name: 'Seller',
  definition(t) {
    t.implements(Node, Timestamps);
    t.string('firstName');
    t.string('middleName');
    t.string('lastName');
    t.phone('phone', { nullable: true });
    t.id('postId', { nullable: true });
    t.list.id('postIds');
    t.field('post', {
      type: Post,
      nullable: true,
      resolve: getPostByPostId,
    });
    t.field('posts', {
      type: PostConnection,
      args: getListArgs,
      // nullable: true,
      resolve: getPostsByPostIds,
    });
    t.positiveInt('seniority', { nullable: true });
    t.field('seniorityType', {
      type: SeniorityType,
      nullable: true,
      resolve: getSeniorityTypeByMonths,
    });
    t.day('dismissDay', { nullable: true });
    t.day('recruitDay', { nullable: true });
    t.field('state', { type: StateEnum });
    t.list.field('appointments', { type: Appointment });
  },
});

export default Seller;
