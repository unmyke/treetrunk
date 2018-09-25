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
    mapper: idSerializer.toDTO,
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
    mapper: postSerializer.toDTO,
  },
  recruitDay: {
    type: CALLBACK,
    mapper: daySerializer.toDTO,
  },
  dismissDay: {
    type: CALLBACK,
    mapper: daySerializer.toDTO,
  },
  seniority: { type: IDENTITY },
  seniorityType: {
    type: INCLUDED,
    getter: ({ seniority }, { seniorityTypes }) => {
      return seniorityTypes
        .filter(({ months }) => months <= seniority)
        .sort((a, b) => a - b)[0];
    },
    mapper: seniorityTypeSerializer.toDTO,
  },
  appointments: {
    type: ARRAY,
    mapper: {
      postId: {
        type: INCLUDED,
        attrName: 'post',
        getter: (postId, seller, { posts }) =>
          posts.find(({ postId: curPostId }) => curPostId.equals(postId)),
        mapper: postSerializer.toDTO,
      },
      day: {
        type: CALLBACK,
        mapper: daySerializer.toDTO,
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
    ref: 'postId',
    dataLinks: {
      self: ({ postId }) => `${this.rootUri}/posts/${postId}`,
    },
  },
  seniorityType: {
    ref: 'seniorityTypeId',
    dataLinks: {
      self: ({ seniorityTypeId }) =>
        `${this.rootUri}/seniority_types/${seniorityTypeId}`,
    },
  },
  appointments: {
    attributes: ['postId', 'day'],
    post: {
      ref: 'postId',
      dataLinks: {
        self: ({ postId }) => `${this.rootUri}/posts/${postId}`,
      },
    },
  },
  // transform: this.toDTO,
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
