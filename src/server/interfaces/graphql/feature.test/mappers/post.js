import timestamp from './timestamp';

const postMapper = ({ postId, name, pieceRates }) => ({
  id: postId,
  name,
  pieceRates,
});

export default timestamp(postMapper);
