import Seller from './seller';
import { getConnection } from '../../generators';

const { Connection: SellerConnection, Edge: SellerEdge } = getConnection(
  Seller
);

export default SellerConnection;
export const contains = [SellerEdge];
