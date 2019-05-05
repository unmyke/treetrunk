import getConnection from './get-connection';
import { getPost } from '../resolvers';

const { Edge, Connection } = getConnection('Post', getPost);

export { Edge, Connection };
