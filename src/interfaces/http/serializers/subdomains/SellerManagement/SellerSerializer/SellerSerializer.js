import { Id as idSerializer, Day as daySerializer } from '../../../commonTypes';
import { PostSerializer } from '../PostSerializer';
import { SeniorityTypeSerializer } from '../SeniorityTypeSerializer';
import { SellerManagementBaseSerializer } from '../SellerManagementBaseSerializer';

const postSerializer = new PostSerializer();
const seniorityTypeSerializer = new SeniorityTypeSerializer();

const mapper = {
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
    getter: (value, { seniority }, included) => {
      return included.seniorityType
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
        getter: (postId, included) =>
          included.post.find(({ postId: curPostId }) =>
            curPostId.equals(postId)
          ),
        mapper: postSerializer.toDTO,
      },
      day: {
        type: CALLBACK,
        mapper: daySerializer.toDTO,
      },
    },
  },
};

export class SellerSerializer extends SellerManagementBaseSerializer {
  constructor() {
    super({
      resourceName: 'seller',
      mapper,
      entityOptions: {
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
          attributes: ['post', 'day'],
          post: {
            ref: 'postId',
            dataLinks: {
              self: ({ postId }) => `${this.rootUri}/posts/${postId}`,
            },
          },
        },
        transform: this.toDTO,
      },
    });
  }
}
