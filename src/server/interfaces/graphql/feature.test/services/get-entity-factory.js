import { createFactory } from '../entity-factory';

const getEntityFactory = ({ subdomainName, entityName }) => {
  const entityFactory = createFactory({ subdomainName, entityName });
  return (id) => entityFactory({ id });
};

export default getEntityFactory;
