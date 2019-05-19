import gql from 'graphql-tag';

const pageInfo = () => gql`
  fragment pageInfo on PageInfo {
    hasNextPage
    hasPreviousPage
    count
  }
`;
export default pageInfo;
