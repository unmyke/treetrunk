import pluralize from 'pluralize';
import { snakeCase } from 'lodash';
import { Serializer, Deserializer } from 'jsonapi-serializer';
import { config } from 'config';
import { errors } from 'src/domain';
import { mapperTypes } from '../mapperTypes';
import { Error as errorSerializer } from '../../commonTypes';

const {
  IDENTITY,
  ID_GENERATOR,
  CALLBACK,
  OBJECT,
  ARRAY,
  INCLUDED,
} = mapperTypes;

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
      typeForAttribute: (attribute) => pluralize(snakeCase(attribute)),
    };
    this.JSONAPISerializerOptions = JSONAPISerializerOptions;
  }

  serializeErrors(error, status) {
    return errorSerializer.serialize(error, status);
  }

  serialize({ data, included }) {
    this.data = data;
    this.included = included;

    const entity = this.toDTO({ data, included });
    // console.log(inspect(entity, { showHidden: false, depth: null }));
    // console.log(
    //   inspect(this.JSONAPISerializerOptions, { showHidden: false, depth: null })
    // );

    return this.JSONAPISerializer.serialize(entity);
  }

  async deserialize(json) {
    const JSONAPIDeserializer = new Deserializer({
      keyForAttribute: 'camelCase',
    });
    this.JSONAPIDeserializer = JSONAPIDeserializer;

    try {
      return this.JSONAPIDeserializer.deserialize(json);
    } catch (error) {
      const err = errors.invalidJSONAPIFormat(error.message);
      throw err;
    }
  }

  setJSONSerializer(type, opts) {
    const JSONAPISerializer = new Serializer(type, opts);
    this.JSONAPISerializer = JSONAPISerializer;
  }

  toDTO = ({ data, included }) => {
    this.JSONAPISerializerOptions.topLevelLinks = {
      self: this.entityResourceUri,
    };

    if (Array.isArray(data)) {
      this.JSONAPISerializerOptions.meta = {
        count: data.length,
      };

      this.setJSONSerializer(this.type, this.JSONAPISerializerOptions);
      return data.map((data) => this._toDTO({ data, included }, this.attrs));
    }

    this.setJSONSerializer(this.type, this.JSONAPISerializerOptions);
    return this._toDTO({ data, included }, this.attrs);
  };

  _toDTO({ data, included }, attrs) {
    const getValue = (value, included, { type, attrs, serializer, getter }) => {
      let result;
      switch (type) {
        case IDENTITY:
          result = value;
          break;

        case ID_GENERATOR:
          result = getter(data);
          break;

        case CALLBACK:
          result = serializer.toDTO({ data: value });
          break;

        case ARRAY:
          result = value.map((item) =>
            this._toDTO({ data: item, included }, attrs)
          );
          break;

        case OBJECT:
          result = serializer.toDTO({ data: item, included });
          break;

        case INCLUDED:
          const entity = getter(data, included);

          if (entity !== undefined) {
            result = serializer.toDTO({ data: entity, included });
          }
          break;

        default:
          throw errors.invalidMapperType();
      }

      return result !== undefined ? result : null;
    };

    const attrNames = Object.keys(attrs);

    return attrNames.reduce((mappedObj, curAttrName) => {
      const mapper = attrs[curAttrName];
      const newAttrName = mapper.attrName || curAttrName;

      return {
        ...mappedObj,
        [newAttrName]: getValue(data[curAttrName], included, mapper),
      };
    }, {});
  }
}