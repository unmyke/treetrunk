import getConnection from './get-connection';
import seller from './seller';

const sellerConnection = getConnection(seller);
export default sellerConnection;
