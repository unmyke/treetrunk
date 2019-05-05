import getConnection from './get-connection';
import { getSeller } from '../resolvers';

const { Edge, Connection } = getConnection('Seller', getSeller);

export { Edge, Connection };
