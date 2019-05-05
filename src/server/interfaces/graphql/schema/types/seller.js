import { objectType } from 'nexus';

import SellerAppointment from './seller-appontment';
import SeniorityType from './seniority-type';
import { Node, Timestamps } from '../interfaces';
import { PostConnection } from '../connections';
import { SellerState } from '../enums';
import { getSeller, getPostsByPostIds } from '../resolvers';

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
      type: PostConnection,
      nullable: true,
      resolve: getPostsByPostIds,
    });
    t.field('seniorityType', {
      type: SeniorityType,
      nullable: true,
    });
    t.day('dismissAt', { nullable: true });
    t.day('recruitedAt', { nullable: true });
    t.field('state', { type: SellerState });
    t.list.field('appointments', { type: SellerAppointment });
  },
});

export default Seller;
