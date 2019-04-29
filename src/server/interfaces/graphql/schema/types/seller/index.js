import { objectType } from 'nexus';

import SellerStateEnum from './seller-state-enum';
import SellerAppointment from './seller-appontment';
import { Node, Timestamps } from '../../interfaces';
import { Day } from '../../scalars';
import Post from '../post';
import SeniorityType from '../seniority-type';

const Seller = objectType({
  name: 'Seller',
  definition(t) {
    t.implements(Node, Timestamps);
    t.string('firstName');
    t.string('middleName');
    t.string('lastName');
    t.phone('phone');
    t.field('post', Post);
    t.field('seniorityType', SeniorityType);
    t.field('dismissAt', Day);
    t.field('recruitedAt', Day);
    t.field('deletedAt', Day);
    t.field('state', SellerStateEnum);
    t.list.field('appointments', SellerAppointment);
  },
});

export default Seller;
