import getMockEntityFactory from '../get-mock-entity-factory';

const getByIdMockService = ({ subdomainName, entityName }) => {
  const entityFactory = getMockEntityFactory({ subdomainName, entityName });
  return (id, fields = {}) => Promise.resolve(entityFactory(id, fields));
};

export default getByIdMockService;
