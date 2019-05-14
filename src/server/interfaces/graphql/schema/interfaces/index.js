import Node from './node';
import Timestamps from './timestamps';
import Edge from './edge';
import Connection, { contains as connectionContains } from './connection';

export default { Node, Timestamps, Connection, Edge };
export const contains = [connectionContains];
