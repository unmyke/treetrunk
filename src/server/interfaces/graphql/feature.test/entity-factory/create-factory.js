import { lowerFirst } from 'lodash';
import container from '@container';
import data from './data';

const { entities } = container;

const createFactory = ({ subdomainName, entityName }) => {
  const Entity = entities[subdomainName][entityName];
  const entityIdPropName = `${lowerFirst(entityName)}Id`;
  const entityData = data[subdomainName][entityName];

  return ({ id, ...data }) =>
    Entity.restore({
      ...entityData,
      [entityIdPropName]: id,
      ...data,
    });
};
export default createFactory;
