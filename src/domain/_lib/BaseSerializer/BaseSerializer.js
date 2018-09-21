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

  serialize({ data, included = {} }) {
    const primaryResourceDto = Array.isArray(data)
      ? data.map((item) => this.toDTO(item))
      : this.toDTO(data);
    const primaryResource = this.serializer.serialize(primaryResourceDto);

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
