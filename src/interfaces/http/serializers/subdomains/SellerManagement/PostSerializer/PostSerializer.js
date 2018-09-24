// import { Serializer } from 'jsonapi-serializer';
import { mapperTypes } from '../../../_lib';
import { Id as idSerializer, Day as daySerializer } from '../../../commonTypes';
import { SellerManagementBaseSerializer } from '../SellerManagementBaseSerializer';

const { IDENTITY, ARRAY, CALLBACK } = mapperTypes;

export class PostSerializer extends SellerManagementBaseSerializer {
  static mapper = {
    postId: {
      type: CALLBACK,
      attrName: 'id',
      toDTO: idSerializer.toDTO,
    },
    name: { type: IDENTITY },
    state: { type: IDENTITY },
    pieceRate: { type: IDENTITY },
    pieceRates: {
      type: ARRAY,
      toDTO: {
        value: { type: IDENTITY },
        day: {
          type: CALLBACK,
          toDTO: daySerializer.toDTO,
        },
      },
    },
  };

  constructor() {
    super({
      resourceName: 'post',
      mapper,
    });
  }

  getOptions() {
    return {
      attributes: ['id', 'name', 'state', 'pieceRate', 'pieceRates'],
      pieceRates: {
        attributes: ['value', 'day'],
      },
      transform: this.toDTO,
    };
  }
}
