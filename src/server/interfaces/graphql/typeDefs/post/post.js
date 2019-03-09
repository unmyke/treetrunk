import { gql } from 'apollo-server';
import PieceRate from './piece-rate';
import DeletableEntityState from '../common/deletable-entity-state';

export default gql`
  type Post {
    id: ID!
    name: String!
    pieceRate: Float
    pieceRates: [${PieceRate}!]!
    state: ${DeletableEntityState}!
  }
`;
