import { Id as idSerializer, Day as daySerializer } from '../../../commonTypes';
import { postSerializer } from '../postSerializer';
import { seniorityTypeSerializer } from '../seniorityTypeSerializer';
import { SellerManagementBaseSerializer } from '../sellerManagementBaseSerializer';

const mapper = {
  sellerId: {
    type: CALLBACK,
    attrName: 'id',
    serialize: idSerializer,
  },
  firstName: { type: IDENTITY },
  middleName: { type: IDENTITY },
  lastName: { type: IDENTITY },
  phone: { type: IDENTITY },
  state: { type: IDENTITY },
  postId: {
    type: INCLUDED,
    attrName: 'post',
    serialize: postSerializer,
  },
  recruitDay: {
    type: CALLBACK,
    serialize: daySerializer,
  },
  dismissDay: {
    type: CALLBACK,
    serialize: daySerializer,
  },
  seniority: { type: IDENTITY },
  seniorityType: {
    type: INCLUDED,
    serialize: seniorityTypeSerializer,
  },
  appointments: {
    type: ARRAY,
    serialize: {
      postId: {
        type: INCLUDED,
        attrName: 'post',
        serialize: postSerializer,
      },
      day: {
        type: CALLBACK,
        serialize: daySerializer,
      },
    },
  },
};

export class SellerSerializer extends SellerManagementBaseSerializer {
  constructor() {
    super({
      resourceName: 'seller',
      mapper,
    });
  }

  getOptions() {
    return {
      attributes: [
        'firstName',
        'middleName',
        'lastName',
        'phone',
        'state',
        'post',
        'recruitDay',
        'dismissDay',
        'seniority',
        'appointments',
      ],
      post: {
        ref: 'postId',
        dataLinks: {
          self: ({ postId }) => `${rootUri}/posts/${postId}`,
        },
      },
      recruitDay,
      dismissDay,
      appointments: {
        attributes: ['post', 'day'],
        post: {
          ref: 'postId',
          dataLinks: {
            self: ({ postId }) => `${rootUri}/posts/${postId}`,
          },
        },
      },
      transform: this.toDTO,
    };
  }
}
