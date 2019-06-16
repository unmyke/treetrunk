const createPieceRate = (
  _,
  { id, pieceRate: { value, day } },
  {
    dataSources: {
      services: { createPostPieceRate },
    },
    serializers: { Post: postSerializer },
  }
) => createPostPieceRate(id, { value, day }).then(postSerializer);

export default createPieceRate;
