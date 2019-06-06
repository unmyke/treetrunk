import gql from 'graphql-tag';

const pageInfo = () => gql`
  fragment pageInfo on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
`;
export default pageInfo;
