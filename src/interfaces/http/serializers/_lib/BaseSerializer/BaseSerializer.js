import pluralize from 'pluralize';
import { Serializer } from 'jsonapi-serializer';
import { config } from 'config';
import { mapperTypes } from '../../_lib';

import { Id as idSerializer } from '../../commonTypes';
import { errors } from '../../../../../domain';

export class BaseSerializer {
  constructor({ resourceName, subdomainResourceName, attrs, entityOptions }) {
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
    this.attrs = attrs;
    this.entityOptions = entityOptions;

    const JSONAPISerializerOptions = {
      ...entityOptions,
      id: idName,
      dataLinks: {
        self: ({ [idName]: idName }) => `${entityResourceUri}/${idName}`,
      },
      keyForAttribute: 'snake_case',
    };

    const JSONAPISerializer = new Serializer(type, JSONAPISerializerOptions);
    this.JSONAPISerializer = JSONAPISerializer;
  }

  serialize({ data, included }) {
    this.data = data;
    this.included = included;

    const entity = this.toDTO({ data, included });

    return this.JSONAPISerializer.serialize(entity);
  }

  toDTO = ({ data, included }) => {
    if (Array.isArray(data)) {
      return data.map((data) => this._toDTO({ data, included }, this.attrs));
    }
    return this._toDTO({ data, included }, this.attrs);
  };

  _toDTO({ data, included }, attrs) {
    const getValue = (value, included, { type, mapper, getter }) => {
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
          const entity = getter(data, included);

          return entity !== undefined
            ? mapper({ data: entity, included })
            : null;

        default:
          throw errors.invalidMapperType();
      }
    };

    const attrNames = Object.keys(attrs);

    return attrNames.reduce((mappedObj, curAttrName) => {
      const { type, attrName, mapper, getter } = attrs[curAttrName];
      const newAttrName = attrName || curAttrName;
      // console.log(attrs);
      return {
        ...mappedObj,
        [newAttrName]: getValue(data[curAttrName], included, {
          type,
          attrName,
          mapper,
          getter,
        }),
      };
    }, {});
  }
}
