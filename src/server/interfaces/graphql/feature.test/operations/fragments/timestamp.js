import gql from 'graphql-tag';

const timestamp = () => gql`
  fragment timestamp on TimestampsInterface {
    createdAt
    updatedAt
    deletedAt
  }
`;
export default timestamp;
