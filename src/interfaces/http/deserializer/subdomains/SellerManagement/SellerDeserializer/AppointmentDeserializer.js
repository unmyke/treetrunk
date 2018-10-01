import { Day as dayDeserializer } from '../../../commonTypes';
import { PostDeserializer } from '../PostDeserializer';
import { SellerManagementBaseDeserializer } from '../SellerManagementBaseDeserializer';
import { mapperTypes } from '../../../_lib';

const { CALLBACK, ID_GENERATOR, INCLUDED } = mapperTypes;

const postDeserializer = new PostDeserializer();

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
    serializer: postDeserializer,
  },
  day: {
    type: CALLBACK,
    serializer: dayDeserializer,
  },
};
const entityOptions = {
  attributes: ['id', 'post', 'day'],
  post: {
    ref: 'id',
    ...postDeserializer.JSONAPIDeserializerOptions,
  },
  // transform: this,
};

export class AppointmentDeserializer extends SellerManagementBaseDeserializer {
  constructor() {
    super({
      resourceName: 'appointment',
      attrs,
      entityOptions,
    });
  }
}
