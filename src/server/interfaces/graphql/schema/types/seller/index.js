import { objectType } from 'nexus';

import SellerStateEnum from './seller-state-enum';
import SellerAppointment from './seller-appontment';
import { Node, Timestamps } from '../../interfaces';
import Post from '../post';
import SeniorityType from '../seniority-type';
import {
  Seller as sellerResolver,
  Post as postResolver,
  SeniorityType as seniorityTypeResolver,
} from '../../resolvers';

const Seller = objectType({
  name: 'Seller',
  resolve: sellerResolver,
  definition(t) {
    t.implements(Node, Timestamps);
    t.string('firstName');
    t.string('middleName');
    t.string('lastName');
    t.phone('phone', { nullable: true });
    t.field('post', {
      type: Post,
      nullable: true,
      resolve: ({ postId }, _, ctx) =>
        postResolver(undefined, { id: postId }, ctx),
    });
    t.field('seniorityType', {
      type: SeniorityType,
      nullable: true,
      resolve: ({ seniority }, _, ctx) =>
        seniorityTypeResolver.byMonths(undefined, { months: seniority }, ctx),
    });
    t.day('dismissAt', { nullable: true });
    t.day('recruitedAt', { nullable: true });
    t.field('state', SellerStateEnum);
    t.list.field('appointments', SellerAppointment);
  },
});

export default Seller;
