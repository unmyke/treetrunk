export const postToDTO = ({ postId, name, currentPieceRate, pieceRates }) => {
  return {
    postId: postId.toString(),
    name,
    currentPieceRate,
    pieceRates: pieceRates.map((pieceRate) => pieceRate.toJSON()),
  };
};
