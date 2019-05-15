import Node from './node';
import Timestamps from './timestamps';
import Edge from './edge';
import Connection, { contains as connectionContains } from './connection';

export default { Node, Timestamps, Edge, Connection };
export const contains = [...connectionContains];
