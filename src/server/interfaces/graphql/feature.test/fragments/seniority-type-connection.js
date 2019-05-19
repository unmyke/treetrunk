import getConnection from './get-connection';
import seniorityType from './seniority-type';

const seniorityTypeConnection = getConnection(seniorityType);
export default seniorityTypeConnection;
