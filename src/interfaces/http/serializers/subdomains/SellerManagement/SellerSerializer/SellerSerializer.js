import { BaseSerializer } from 'src/domain/_lib';
import { mapperTypes } from '../../../_lib';
import { Id as IdSerializer, Day as daySerializer } from '../../../commonTypes';
import { PostSerializer } from '../PostSerializer';
import { SeniorityTypeSerializer } from '../SeniorityTypeSerializer';

const { IDENTITY, ARRAY, CALLBACK } = mapperTypes;

export class SellerSerializer extends BaseSerializer {
  static resourceName = 'sellers';

  static includedSerializer = {
    posts: new PostSerializer(),
    seniorityTypes: new SeniorityTypeSerializer(),
  };

  static mapper = {
    sellerId: {
      type: CALLBACK,
      attrName: 'id',
      serialize: IdSerializer.serialize,
    },
    firstName: { type: IDENTITY },
    middleName: { type: IDENTITY },
    lastName: { type: IDENTITY },
    phone: { type: IDENTITY },
    state: { type: IDENTITY },
    links: {
      type: CALLBACK,
      serialize: (curValue, { sellerId: { value } }) => ({
        self: `http://${this.constructor.config.domain}:${
          this.constructor.config.port
        }/seller_management/${this.constructor.propName}/${value}`,
      }),
    },
    postId: {
      type: CALLBACK,
      attrName: 'post',
      serialize: IdSerializer.serialize,
    },
    recruitDay: {
      type: CALLBACK,
      serialize: daySerializer.serialize,
    },
    dismissDay: {
      type: CALLBACK,
      serialize: daySerializer.serialize,
    },
    seniority: { type: IDENTITY },
    appointments: {
      type: ARRAY,
      serialize: {
        postId: {
          type: CALLBACK,
          attrName: 'post',
          serialize: IdSerializer.serialize,
        },
        day: {
          type: CALLBACK,
          serialize: daySerializer.serialize,
        },
      },
    },
  };
}
