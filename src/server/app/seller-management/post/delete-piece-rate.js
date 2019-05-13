const DeletePieceRate = ({
  repositories: { Post: postRepo },
  commonTypes: { PostId, Day },
}) => (postIdValue, date) =>
  postRepo.getById(new PostId({ value: postIdValue })).then((post) => {
    post.deletePieceRateAt(new Day({ value: new Date(date) }));

    return postRepo.save(post);
  });

export default DeletePieceRate;
