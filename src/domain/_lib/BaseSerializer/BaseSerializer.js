import { snakeCase, lowerFirst } from 'lodash';
import { Serializer } from 'jsonapi-serializer';

import {
  toDTO,
  getResorceAttibutes,
} from 'src/interfaces/http/serializers/_lib';

export class BaseSerializer {
  toDTO(entity) {
    return toDTO(entity, this.constructor.mapper);
  }

  serialize({ data, includes }) {
    const dataResourceType = snakeCase(lowerFirst(data.constructor.name));
    const dataAttrs = getResorceAttibutes(data);
  }
}
