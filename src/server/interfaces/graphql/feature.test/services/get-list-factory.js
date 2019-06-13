import { createFactory } from '../entities';

const getListFactory = ({ subdomainName, entityName }) => {
  const entityFactory = createFactory({ subdomainName, entityName });
  return (listArgs) => {
    const { filter: { fields: [{ value: ids }] = [{}] } = {} } = listArgs;
    const entities = ids
      ? ids.map((id) => entityFactory({ id }))
      : Array.from();
  };
};

export default getListFactory;
