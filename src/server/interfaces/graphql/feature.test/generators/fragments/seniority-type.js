import gql from 'graphql-tag';

import node from './node';
import timestamp from './timestamp';

const seniorityType = () => gql`
  fragment seniorityType on SeniorityType {
    ...node
    name
    months
    award
    awards {
      value
      day
    }
    ...timestamp
  }
  ${node()}
  ${timestamp()}
`;
export default seniorityType;
