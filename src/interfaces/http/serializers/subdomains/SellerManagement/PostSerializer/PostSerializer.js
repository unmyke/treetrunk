// import { Serializer } from 'jsonapi-serializer';
import { mapperTypes } from '../../../_lib';
import { BaseSerializer } from 'src/domain/_lib';
import { Id as IdSerializer, Day as daySerializer } from '../../../commonTypes';

const { IDENTITY, ARRAY, CALLBACK } = mapperTypes;

export class PostSerializer extends BaseSerializer {
  static mapper = {
    postId: {
      type: CALLBACK,
      propName: 'id',
      serialize: IdSerializer.serialize,
    },
    name: { type: IDENTITY },
    state: { type: IDENTITY },
    pieceRate: { type: IDENTITY },
    pieceRates: {
      type: ARRAY,
      serialize: {
        value: { type: IDENTITY },
        day: {
          type: CALLBACK,
          serialize: daySerializer.serialize,
        },
      },
    },
  };
}
