import { SellerManagementBaseDeserializer } from '../SellerManagementBaseDeserializer';
import { mapperTypes } from '../../../_lib';
import {
  Id as idDeserializer,
  Day as dayDeserializer,
} from '../../../commonTypes';

const { IDENTITY, ARRAY, CALLBACK } = mapperTypes;

const attrs = {
  seniorityTypeId: {
    type: CALLBACK,
    attrName: 'id',
    serializer: idDeserializer,
  },
  name: { type: IDENTITY },
  months: { type: IDENTITY },
  state: { type: IDENTITY },
  award: { type: IDENTITY },
  awards: {
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
  attributes: ['id', 'name', 'months', 'state', 'award', 'awards'],
  awards: {
    attributes: ['value', 'day'],
  },
  // transform: this.toDTO,
};

export class SeniorityTypeDeserializer extends SellerManagementBaseDeserializer {
  constructor() {
    super({
      resourceName: 'seniority_type',
      attrs,
      entityOptions,
    });
  }
}
