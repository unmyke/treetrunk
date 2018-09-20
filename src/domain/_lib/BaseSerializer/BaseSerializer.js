import { Serializer } from 'jsonapi-serializer';

import {
  toDTO,
  getResorceAttibutes,
} from 'src/interfaces/http/serializers/_lib';

export class BaseSerializer {
  constructor() {
    this.serializer = new Serializer(this.constructor.resourceName, {
      ...getResorceAttibutes(this.constructor.mapper),
      keyForAttribute: 'snake_case',
    });
  }

  toDTO(entity) {
    return toDTO(entity, this.constructor.mapper);
  }

  serialize({ data, included }) {
    const primaryResourceDto = Array.isArray(data)
      ? data.map(this.toDTO)
      : this.toDTO(data);
    const primaryResource = this.serializer.serialize(primaryResourceDto);

    const includedResources = Object.keys(included).map(
      (includedResourceName) => {
        const includedSerializer = this.constructor.includedSerializer[
          includedResourceName
        ];
        console.log(included[includedResourceName]);
        return includedSerializer.serialize(included[includedResourceName]);
      }
    );

    return { ...primaryResource, included: includedResources };
  }
}
