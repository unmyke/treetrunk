import gql from 'graphql-tag';

const node = () => gql`
  fragment node on NodeInterface {
    id
  }
`;
export default node;
