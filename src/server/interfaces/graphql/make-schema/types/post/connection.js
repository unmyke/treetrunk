import Post from './post';
import { getConnection } from '../../generators';

const { Connection: PostConnection, Edge: PostEdge } = getConnection(Post);

export default PostConnection;
export const contains = [PostEdge];
