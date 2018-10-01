import { mapperTypes } from '../../../_lib';
import {
  Id as idDeserializer,
  Day as dayDeserializer,
} from '../../../commonTypes';
import { SellerManagementBaseDeserializer } from '../SellerManagementBaseDeserializer';

const { IDENTITY, ARRAY, CALLBACK } = mapperTypes;

const attrs = {
  postId: {
    type: CALLBACK,
    attrName: 'id',
    serializer: idDeserializer,
  },
  name: { type: IDENTITY },
  state: { type: IDENTITY },
  pieceRate: { type: IDENTITY },
  pieceRates: {
    type: ARRAY,
    attrs: {
      value: { type: IDENTITY },
      day: {
        type: CALLBACK,
        serializer: dayDeserializer,
      },
    },
  },
};

const entityOptions = {
  attributes: ['id', 'name', 'state', 'pieceRate', 'pieceRates'],
  pieceRates: {
    attributes: ['value', 'day'],
  },
  // transform: this,
};

export class PostDeserializer extends SellerManagementBaseDeserializer {
  constructor() {
    super({
      resourceName: 'post',
      attrs,
      entityOptions,
    });
  }
}
