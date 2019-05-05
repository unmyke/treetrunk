import getConnection from './get-connection';
import { getSeniorityType } from '../resolvers';

const { Edge, Connection } = getConnection('SeniorityType', getSeniorityType);

export { Edge, Connection };
