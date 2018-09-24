// import { Serializer } from 'jsonapi-serializer';
import { BaseSerializer } from 'src/domain/_lib';
import { mapperTypes } from '../../../_lib';
import { Id as idSerializer, Day as daySerializer } from '../../../commonTypes';

const { IDENTITY, ARRAY, CALLBACK } = mapperTypes;

export class SeniorityTypeSerializer extends BaseSerializer {
  static mapper = {
    seniorityTypeId: {
      type: CALLBACK,
      attrName: 'id',
      serialize: idSerializer.serialize,
    },
    name: { type: IDENTITY },
    state: { type: IDENTITY },
    award: { type: IDENTITY },
    awards: {
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

  constructor() {
    super({
      resourceName: 'seniority_type',
      mapper,
      entityOptions: {
        attributes: ['id', 'name', 'months', 'state', 'award', 'award'],
        appointments: {
          attributes: ['value', 'day'],
        },
        transform: this.toDTO,
      },
    });
  }
}
