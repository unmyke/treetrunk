import SeniorityType from './seniority-type';
import { getTypeConnection } from '../../(ctx)';

const {
  Connection: SeniorityTypeConnection,
  Edge: SeniorityTypeEdge,
} = getTypeConnection(SeniorityType);

export default SeniorityTypeConnection;
export const contains = [SeniorityTypeEdge];
