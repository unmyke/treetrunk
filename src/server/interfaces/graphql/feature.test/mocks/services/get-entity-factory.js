import getMockEntityFactory from '../get-mock-entity-factory';

const getByIdMockService = ({ subdomainName, entityName }) => {
  const entityFactory = getMockEntityFactory({ subdomainName, entityName });
  return (id) => entityFactory({ id });
};

export default getByIdMockService;
