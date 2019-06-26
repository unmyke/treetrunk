const deletePieceRate = (
  _,
  { id, day },
  {
    dataSources: {
      services: { deletePostPieceRate },
    },
    serializers: { Post: postSerializer },
  }
) => deletePostPieceRate(id, day).then(postSerializer);

export default deletePieceRate;
