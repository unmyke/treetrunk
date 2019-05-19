import getConnection from './get-connection';
import post from './post';

const postConnection = getConnection(post);
export default postConnection;
