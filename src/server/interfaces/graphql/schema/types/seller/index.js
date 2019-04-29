import { objectType } from 'nexus';

import SellerStateEnum from './seller-state-enum';
import SellerAppointment from './seller-appontment';
import { Node, Timestamps } from '../../interfaces';
import { Day } from '../../scalars';
import Post from '../post';
import SeniorityType from '../seniority-type';
import {
  Post as postResolver,
  SeniorityType as seniorityTypeResolver,
} from '../../resolvers';

const Seller = objectType({
  name: 'Seller',
  definition(t) {
    t.implements(Node, Timestamps);
    t.string('firstName');
    t.string('middleName');
    t.string('lastName');
    t.phone('phone', { nullable: true });
    t.field('post', {
      type: Post,
      nullable: true,
      resolve: postResolver,
    });
    t.field('seniorityType', {
      type: SeniorityType,
      nullable: true,
      resolve: seniorityTypeResolver,
    });
    t.field('dismissAt', {
      type: Day,
      nullable: true,
    });
    t.field('recruitedAt', {
      type: Day,
      nullable: true,
    });
    t.field('state', SellerStateEnum);
    t.list.field('appointments', SellerAppointment);
  },
});

export default Seller;
