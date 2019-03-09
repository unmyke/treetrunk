import { gql } from 'apollo-server';

export default gql`
  enum DeletableEntityState {
    ACTIVE
    DELETED
  }
`;
