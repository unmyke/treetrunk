import { lowerFirst } from 'lodash';
import container from '@container';
import data from './data';

const { entities } = container;

const getMockEntityFactory = ({ subdomainName, entityName }) => {
  const Entity = entities[subdomainName][entityName];
  const entityIdPropName = `${lowerFirst(Entity)}Id`;
  const entityData = data[subdomainName][entityName];

  return (id, fields = {}) =>
    Entity.restore({
      ...entityData,
      ...(id ? { [entityIdPropName]: id } : {}),
      ...fields,
    });
};
export default getMockEntityFactory;
