const updatePieceRate = (
  _,
  { id, day, newPieceRate: { value: newValue, day: newDay } },
  {
    dataSources: {
      services: { updatePostPieceRate },
    },
    serializers: { Post: postSerializer },
  }
) =>
  updatePostPieceRate(id, day, { value: newValue, day: newDay }).then(
    postSerializer
  );

export default updatePieceRate;
