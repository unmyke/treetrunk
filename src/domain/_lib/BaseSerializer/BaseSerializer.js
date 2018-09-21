import { Serializer } from 'jsonapi-serializer';
import {} from 'config/application';

import {
  toDTO,
  getResorceAttibutes,
} from 'src/interfaces/http/serializers/_lib';

export class BaseSerializer {
  constructor() {
    this.JSONAPISerializer = new Serializer(this.constructor.resourceName, {
      ...getResorceAttibutes(this.constructor.mapper),
      keyForAttribute: 'snake_case',
    });
  }

  toDTO(entity, parentEntity) {
    return toDTO(entity, parentEntity, this.constructor.mapper);
  }

  serialize({ data, included = {} }) {
    const primaryResourceDto = Array.isArray(data)
      ? data.map((item) => this.toDTO(item, data))
      : this.toDTO(data);
    const primaryResource = this.JSONAPISerializer.serialize(
      primaryResourceDto
    );

    const includedResources = Object.keys(included).reduce(
      (includedResources, includedResourceName) => {
        const includedSerializer = this.constructor.includedSerializer[
          includedResourceName
        ];

        return [
          ...includedResources,
          ...includedSerializer.serialize({
            data: included[includedResourceName],
          }).data,
        ];
      },
      []
    );

    return { ...primaryResource, included: includedResources };
  }
}
