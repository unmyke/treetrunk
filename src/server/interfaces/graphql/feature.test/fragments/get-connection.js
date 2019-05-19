import gql from 'graphql-tag';
import { upperFirst } from 'lodash';

import pageInfo from './page-info';

const getConnection = (type) => () => {
  const { name } = type;
  const Name = upperFirst(name);

  return gql`
    fragment ${name}Connection on ${Name}Connection {
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
export default getConnection;
