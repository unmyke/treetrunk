// import { Serializer } from 'jsonapi-serializer';
import { SellerManagementBaseSerializer } from '../SellerManagementBaseSerializer';
import { mapperTypes } from '../../../_lib';
import { Id as idSerializer, Day as daySerializer } from '../../../commonTypes';

const { IDENTITY, ARRAY, CALLBACK } = mapperTypes;

const attrs = {
  seniorityTypeId: {
    type: CALLBACK,
    attrName: 'id',
    serializer: idSerializer,
  },
  name: { type: IDENTITY },
  state: { type: IDENTITY },
  award: { type: IDENTITY },
  awards: {
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
  attributes: ['id', 'name', 'months', 'state', 'award', 'awards'],
  awards: {
    attributes: ['value', 'day'],
  },
  // transform: this.toDTO,
};

export class SeniorityTypeSerializer extends SellerManagementBaseSerializer {
  constructor() {
    super({
      resourceName: 'seniority_type',
      attrs,
      entityOptions,
    });
  }
}
