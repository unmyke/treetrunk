import {
  Id as idDeserializer,
  Day as dayDeserializer,
} from '../../../commonTypes';
import { PostDeserializer } from '../PostDeserializer';
import { SeniorityTypeDeserializer } from '../SeniorityTypeDeserializer';
import { SellerManagementBaseDeserializer } from '../SellerManagementBaseDeserializer';
import { AppointmentDeserializer } from './AppointmentDeserializer';
import { mapperTypes } from '../../../_lib';

const { IDENTITY, ARRAY, CALLBACK, INCLUDED } = mapperTypes;

const postDeserializer = new PostDeserializer();
const seniorityTypeDeserializer = new SeniorityTypeDeserializer();
const appointmentDeserializer = new AppointmentDeserializer();

const attrs = {
  sellerId: {
    type: CALLBACK,
    attrName: 'id',
    serializer: idDeserializer,
  },
  firstName: { type: IDENTITY },
  middleName: { type: IDENTITY },
  lastName: { type: IDENTITY },
  phone: { type: IDENTITY },
  state: { type: IDENTITY },
  postId: {
    type: INCLUDED,
    attrName: 'post',
    getter: ({ postId }, { posts }) => {
      if (postId === undefined) {
        return;
      }
      return posts.find(({ postId: curPostId }) => curPostId.equals(postId));
    },
    serializer: postDeserializer,
  },
  recruitDay: {
    type: CALLBACK,
    serializer: dayDeserializer,
  },
  dismissDay: {
    type: CALLBACK,
    serializer: dayDeserializer,
  },
  seniority: { type: IDENTITY },
  seniorityType: {
    type: INCLUDED,
    getter: ({ seniority }, { seniorityTypes }) => {
      if (seniority !== undefined) {
        return seniorityTypes
          .filter(({ months }) => seniority >= months)
          .sort(({ months: a }, { months: b }) => b - a)[0];
      }
    },
    serializer: seniorityTypeDeserializer,
  },
  appointments: {
    type: ARRAY,
    attrs: {
      ...appointmentDeserializer.attrs,
    },
  },
};
const entityOptions = {
  attributes: [
    'id',
    'firstName',
    'middleName',
    'lastName',
    'phone',
    'state',
    'recruitDay',
    'dismissDay',
    'seniority',
    'seniorityType',
    'post',
    'appointments',
  ],
  post: {
    ref: 'id',
    ...postDeserializer.JSONAPIDeserializerOptions,
  },
  seniorityType: {
    ref: 'id',
    type: 'seniority_types',
    ...seniorityTypeDeserializer.JSONAPIDeserializerOptions,
  },
  appointments: {
    ref: 'id',
    ...appointmentDeserializer.JSONAPIDeserializerOptions,
  },
  // transform: this,
};

export class SellerDeserializer extends SellerManagementBaseDeserializer {
  constructor() {
    super({
      resourceName: 'seller',
      attrs,
      entityOptions,
    });
  }
}
