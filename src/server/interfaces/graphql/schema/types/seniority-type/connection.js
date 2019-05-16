import SeniorityType from './seniority-type';
import { getConnection } from '../../generators';

const {
  Connection: SeniorityTypeConnection,
  Edge: SeniorityTypeEdge,
} = getConnection(SeniorityType);

export default SeniorityTypeConnection;
export const contains = [SeniorityTypeEdge];
