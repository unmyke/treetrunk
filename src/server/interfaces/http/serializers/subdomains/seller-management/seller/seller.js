import {
  Id as idSerializer,
  Day as daySerializer,
} from '../../../common-types';
import PostSerializer from '../post';
import SeniorityTypeSerializer from '../seniority-type';
import SellerManagementBaseSerializer from '../seller-management-base';
import AppointmentSerializer from './appointment';
import { mapperTypes } from '../../../_lib';

const { IDENTITY, ARRAY, CALLBACK, INCLUDED } = mapperTypes;

const postSerializer = new PostSerializer();
const seniorityTypeSerializer = new SeniorityTypeSerializer();
const appointmentSerializer = new AppointmentSerializer();

const attrs = {
  sellerId: {
    type: CALLBACK,
    attrName: 'id',
    serializer: idSerializer,
  },
  fullName: { type: IDENTITY },
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
    serializer: postSerializer,
  },
  recruitDay: {
    type: CALLBACK,
    serializer: daySerializer,
  },
  dismissDay: {
    type: CALLBACK,
    serializer: daySerializer,
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
    serializer: seniorityTypeSerializer,
  },
  appointments: {
    type: ARRAY,
    attrs: {
      ...appointmentSerializer.attrs,
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
    ...postSerializer.JSONAPISerializerOptions,
  },
  seniorityType: {
    ref: 'id',
    type: 'seniority_types',
    ...seniorityTypeSerializer.JSONAPISerializerOptions,
  },
  appointments: {
    ref: 'id',
    ...appointmentSerializer.JSONAPISerializerOptions,
  },
  // transform: this,
};

export default class SellerSerializer extends SellerManagementBaseSerializer {
  constructor() {
    super({
      resourceName: 'seller',
      attrs,
      entityOptions,
    });
  }
}
