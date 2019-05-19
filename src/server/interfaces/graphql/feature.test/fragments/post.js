import gql from 'graphql-tag';

import node from './node';
import timestamp from './timestamp';

const post = () => gql`
  fragment post on Post {
    ...node
    name
    pieceRate
    pieceRates {
      value
      day
    }
    ...timestamp
  }
  ${node()}
  ${timestamp()}
`;
export default post;
