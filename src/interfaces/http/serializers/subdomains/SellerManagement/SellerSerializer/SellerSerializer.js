// import { Serializer } from 'jsonapi-serializer';
import { BaseSerializer } from 'src/domain/_lib';
import { mapperTypes } from '../../../_lib';
import { Id as IdSerializer, Day as daySerializer } from '../../../commonTypes';

const { IDENTITY, ARRAY, CALLBACK } = mapperTypes;

export class SellerSerializer extends BaseSerializer {
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
