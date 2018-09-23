import pluralize from 'pluralize';
import { Serializer } from 'jsonapi-serializer';
import { config } from 'config';

import { Id as idSerializer } from '../../commonTypes';

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

    const entityOptions = this.getOptions();
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

  toDTO({ data, included }) {
    return this._toDTO({ data, included }, this.mapper);
  }
}
