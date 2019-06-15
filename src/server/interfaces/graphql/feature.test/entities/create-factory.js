import { lowerFirst } from 'lodash';
import container from '@container';
import mockEntities from './mock-entities';

const { entities } = container;

const createFactory = ({ subdomainName, entityName }) => {
  const Entity = entities[subdomainName][entityName];
  const entityIdPropName = `${lowerFirst(entityName)}Id`;
  const entityData = mockEntities[subdomainName][entityName];

  return ({ id, ...data }) =>
    Entity.restore({
      ...entityData,
      ...(id ? { [entityIdPropName]: id } : {}),
      ...data,
    });
};
export default createFactory;
