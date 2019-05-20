import gql from 'graphql-tag';

import node from './node';
import timestamp from './timestamp';
import post from './post';
import postConnection from './post-connection';
import seniorityType from './seniority-type';

const seller = (postCount) => gql`
  fragment seller on Seller {
    ...node
    firstName
    middleName
    lastName
    phone
    post {
      ...post
    }
    posts(sort: { field: "day", order: DESC }) {
      ...postConnection
    }
    appointments {
      post {
        ...post
      }
      day
    }
    seniorityType {
      ...seniorityType
    }
    recruitDay
    dismissDay
    ...timestamp
  }
  ${node()}
  ${timestamp()}
  ${post()}
  ${postConnection()}
  ${node()}
  ${seniorityType()}
`;
export default seller;
