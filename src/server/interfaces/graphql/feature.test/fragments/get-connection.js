import gql from 'graphql-tag';
import { upperFirst } from 'lodash';

import pageInfo from './page-info';

const getConnection = (type) => {
  const { name } = type;
  const Name = upperFirst(name);
  const connectionName = `${name}Connection`;

  const connection = () => {
    return gql`
    fragment ${connectionName} on ${Name}Connection {
      edges {
        cursor
        node {
          ...${name}
        }
      }
      pageInfo {
        ...pageInfo
      }
    }
    ${type()}
    ${pageInfo()}
  `;
  };

  Object.defineProperty(connection, 'name', { value: connectionName });

  return connection;
};
export default getConnection;
