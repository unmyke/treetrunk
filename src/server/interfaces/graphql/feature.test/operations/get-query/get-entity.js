import gql from 'graphql-tag';
import { upperFirst } from 'lodash';

const getEntity = (type) => {
  const { name } = type;
  const Name = upperFirst(name);

  return gql`
    query ${Name}ById($id: ID!) {
      ${name}(id: $id) {
        ...${name}
      }
    }
    ${type()}
  `;
};
export default getEntity;
