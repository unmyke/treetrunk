import gql from 'graphql-tag';

import node from './node';
import timestamp from './timestamp';
import post from './post';
import postConnection from './post-connection';
import seniorityType from './seniority-type';

const seller = () => gql`
  fragment seller on Seller {
    ...node
    firstName
    middleName
    lastName
    phone
    postId
    postIds
    post {
      ...post
    }
    posts {
      ...postConnection
    }
    appointments {
      postId
      post {
        ...post
      }
      day
    }
    seniority
    seniorityType {
      ...seniorityType
    }
    recruitDay
    dismissDay
    state
    ...timestamp
  }
  ${node()}
  ${timestamp()}
  ${post()}
  ${postConnection()}
  ${seniorityType()}
`;
export default seller;
