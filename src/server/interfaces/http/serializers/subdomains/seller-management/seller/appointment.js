import { Day as daySerializer } from '../../../common-types';
import PostSerializer from '../post';
import SellerManagementBaseSerializer from '../seller-management-base';
import { mapperTypes } from '../../../_lib';

const { CALLBACK, ID_GENERATOR, INCLUDED } = mapperTypes;

const postSerializer = new PostSerializer();

const attrs = {
  id: {
    type: ID_GENERATOR,
    getter: ({ postId: { value: postId }, day: { value: day } }) =>
      `${postId}-${day.valueOf()}`,
  },
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
  day: {
    type: CALLBACK,
    serializer: daySerializer,
  },
};
const entityOptions = {
  attributes: ['id', 'post', 'day'],
  post: {
    ref: 'id',
    ...postSerializer.JSONAPISerializerOptions,
  },
  // transform: this,
};

export default class AppointmentSerializer extends SellerManagementBaseSerializer {
  constructor() {
    super({
      resourceName: 'appointment',
      attrs,
      entityOptions,
    });
  }
}
