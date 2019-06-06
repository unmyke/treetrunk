import { getList } from './get-query';
import { seller, sellerConnection } from './fragments';

const SELLERS = getList(seller, sellerConnection);
export default SELLERS;
