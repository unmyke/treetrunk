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
    const entityResourceUri = `${rootUri}/${type}`;

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
      dataLinks: {
        self: ({ id }) => `${entityResourceUri}/${id}`,
      },
      keyForAttribute: 'snake_case',
      nullIfMissing: true,
    };

    const JSONAPISerializer = new Serializer(type, JSONAPISerializerOptions);
    this.JSONAPISerializer = JSONAPISerializer;
    // console.log(JSONAPISerializerOptions);
  }

  serialize({ data, included }) {
    this.data = data;
    this.included = included;

    const entity = this.toDTO({ data, included });
    console.log(entity);

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
      let result;
      switch (type) {
        case mapperTypes.IDENTITY:
          result = value;
          break;

        case mapperTypes.CALLBACK:
          result = mapper({ data: value });
          break;

        case mapperTypes.ARRAY:
          result = value.map((item) => mapper({ data: item, included }));
          break;

        case mapperTypes.OBJECT:
          result = mapper({ data: item, included });
          break;

        case mapperTypes.INCLUDED:
          const entity = getter(data, included);

          if (entity !== undefined) {
            result = mapper({ data: entity, included });
          }
          break;

        default:
          throw errors.invalidMapperType();
      }

      return result !== undefined ? result : null;
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
