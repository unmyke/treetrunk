export const postToDTO = ({ postId, name, pieceRate, pieceRates }) => {
  return {
    postId: postId.toString(),
    name,
    pieceRate,
    pieceRates: pieceRates.map((pieceRate) => pieceRate.toJSON()),
  };
};
