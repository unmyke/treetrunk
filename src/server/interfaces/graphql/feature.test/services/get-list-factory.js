import uuidv4 from 'uuid/v4';
import { createFactory } from '../entities';
import getArrayByCallback from './get-array-by-callback';

const getEntityByFactory = (entityFactory) => (id) => entityFactory({ id });

const getListFactory = ({
  subdomainName,
  entityName,
  count,
  hasBefore,
  hasAfter,
}) => {
  const entityFactory = createFactory({ subdomainName, entityName });
  const getEntity = getEntityByFactory(entityFactory);
  const uuidArray = getArrayByCallback(count, uuidv4);
  return (listArgs) => {
    const { filter: { fields: [{ value: ids }] = [{}] } = {} } = listArgs;
    const entities = (ids ? ids : uuidArray).map(getEntity);

    return {
      entities,
      hasBefore,
      hasAfter,
    };
  };
};

export default getListFactory;
