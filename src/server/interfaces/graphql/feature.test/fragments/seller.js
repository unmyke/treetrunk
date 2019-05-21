import gql from 'graphql-tag';

import node from './node';
import timestamp from './timestamp';

const seller = () => gql`
  fragment seller on Seller {
    ...node
    firstName
    middleName
    lastName
    phone
    postId
    postIds
    appointments {
      postId
      day
    }
    seniority
    recruitDay
    dismissDay
    ...timestamp
  }
  ${node()}
  ${timestamp()}
  ${node()}
`;
export default seller;
