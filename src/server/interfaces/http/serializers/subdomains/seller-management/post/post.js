// import { Serializer } from 'jsonapi-serializer';
import { mapperTypes } from '../../../_lib';
import {
  Id as idSerializer,
  Day as daySerializer,
} from '../../../common-types';
import SellerManagementBaseSerializer from '../seller-management-base';

const { IDENTITY, ARRAY, CALLBACK } = mapperTypes;

const attrs = {
  postId: {
    type: CALLBACK,
    attrName: 'id',
    serializer: idSerializer,
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
        serializer: daySerializer,
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

export default class PostSerializer extends SellerManagementBaseSerializer {
  constructor() {
    super({
      resourceName: 'post',
      attrs,
      entityOptions,
    });
  }
}
