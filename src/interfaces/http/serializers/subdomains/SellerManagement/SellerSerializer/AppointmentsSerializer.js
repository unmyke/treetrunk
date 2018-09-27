import { Id as idSerializer, Day as daySerializer } from '../../../commonTypes';
import { PostSerializer } from '../PostSerializer';
import { SeniorityTypeSerializer } from '../SeniorityTypeSerializer';
import { SellerManagementBaseSerializer } from '../SellerManagementBaseSerializer';
import { mapperTypes } from '../../../_lib';

const { IDENTITY, ARRAY, CALLBACK, INCLUDED } = mapperTypes;

const postSerializer = new PostSerializer();
const seniorityTypeSerializer = new SeniorityTypeSerializer();

const attrs = {
  id: {
    type: INCLUDED,
    getter: ({ postId: { value: postId }, day: { value: day } }) =>
      `${postId}-${day}`,
    serializer: {
      toDTO(value) {
        return value;
      },
    },
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
      postId: {
        type: INCLUDED,
        attrName: 'post',
        getter: ({ postId }, { posts }) => {
          if (postId === undefined) {
            return;
          }
          return posts.find(({ postId: curPostId }) =>
            curPostId.equals(postId)
          );
        },
        serializer: postSerializer,
      },
      day: {
        type: CALLBACK,
        serializer: daySerializer,
      },
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
    attributes: ['post', 'day'],
    post: {
      ref: 'id',
      ...postSerializer.JSONAPISerializerOptions,
    },
  },
  // transform: this,
};

export class AppointmentSerializer extends SellerManagementBaseSerializer {
  constructor() {
    super({
      resourceName: 'appointment',
      attrs,
      entityOptions,
    });
  }
}
