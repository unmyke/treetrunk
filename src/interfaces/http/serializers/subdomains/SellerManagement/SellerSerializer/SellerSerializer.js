import { Id as idSerializer, Day as daySerializer } from '../../../commonTypes';
import { PostSerializer } from '../PostSerializer';
import { SeniorityTypeSerializer } from '../SeniorityTypeSerializer';
import { SellerManagementBaseSerializer } from '../SellerManagementBaseSerializer';
import { mapperTypes } from '../../../_lib';

const { IDENTITY, ARRAY, CALLBACK, INCLUDED } = mapperTypes;

const postSerializer = new PostSerializer();
const seniorityTypeSerializer = new SeniorityTypeSerializer();

const attrs = {
  sellerId: {
    type: CALLBACK,
    attrName: 'id',
    serializer: idSerializer,
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
      return seniorityTypes
        .filter(({ months }) => months <= seniority)
        .sort((a, b) => a - b)[0];
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
    'post',
    'recruitDay',
    'dismissDay',
    'seniority',
    'seniorityType',
    'appointments',
  ],
  post: {
    ref: 'id',
    ...postSerializer.JSONAPISerializerOptions,
  },
  seniorityType: {
    ref: 'id',
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

export class SellerSerializer extends SellerManagementBaseSerializer {
  constructor() {
    super({
      resourceName: 'seller',
      attrs,
      entityOptions,
    });
  }
}
