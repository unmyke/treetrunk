import pluralize from 'pluralize';
import { Serializer } from 'jsonapi-serializer';
import { config } from 'config';
import { mapperTypes } from '../../_lib';

import { Id as idSerializer } from '../../commonTypes';
import { errors } from '../../../../../domain';

export class BaseSerializer {
  constructor({ resourceName, subdomainResourceName, mapper }) {
    const server = { ...config.web };
    this.server = server;

    const type = pluralize(resourceName);
    const idName = `${resourceName}Id`;

    const rootUri = `http://${server.domain}:${
      server.port
    }/${subdomainResourceName}`;
    const entityResourceUri = `${this.rootUri}/${this.type}`;

    this.subdomainResourceName = subdomainResourceName;
    this.resourceName = resourceName;
    this.type = type;
    this.idName = idName;

    this.rootUri = rootUri;
    this.entityResourceUri = entityResourceUri;
    this.mapper = mapper;
    this.entityOptions = entityOptions;

    const entityOptions = this.getOptions();
    const JSONAPISerializerOptions = {
      ...entityOptions,
      id: idName,
      dataLinks: {
        self: ({ [idName]: idName }) =>
          `${entityResourceUri}/${idSerializer.serialize(idName)}`,
      },
      keyForAttribute: 'snake_case',
    };

    const JSONAPISerializer = new Serializer(type, JSONAPISerializerOptions);
    this.JSONAPISerializer = JSONAPISerializer;
  }

  serialize({ data, included }) {
    this.data = data;
    this.included = included;

    const entity = this.toDTO({ data, included }, this.mapper);

    return this.JSONAPISerializer.serialize(entity);
  }

  toDTO = ({ data, included }, parentObj) => {
    return this._toDTO({ data, included }, this.mapper);
  };

  _toDTO({ data, included }, { type, attrName, mapper, getter }) {
    const getValue = (value, included, { type, attrName, mapper, getter }) => {
      switch (type) {
        case mapperTypes.IDENTITY:
          return value !== undefined ? value : null;

        case mapperTypes.CALLBACK:
          return mapper(value);

        case mapperTypes.ARRAY:
          return value.map((item) => mapper({ data: item, included }));

        case mapperTypes.OBJECT:
          return mapper({ data: item, included });

        case mapperTypes.INCLUDED:
          const entity = included[attrName].find(getter);

          return mapper({ data: entity, included });

        default:
          throw errors.invalidMapperType();
      }
    };
    const attrNames = Object.keys(mapper);

    return attrNames.reduce((mappedObj, curAttrName) => {
      const newAttrName = attrName || curAttrName;
      return {
        ...mappedObj,
        [newAttrName]: getValue(data[attrName], include, {
          type,
          attrName,
          mapper: mapper[attrName],
        }),
      };
    }, {});
  }
}
