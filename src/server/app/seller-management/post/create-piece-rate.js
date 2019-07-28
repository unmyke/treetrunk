const CreatePieceRate = ({
  repositories: { Post: postRepo },
  commonTypes: { PostId, Day },
}) => (postIdValue, { value, day: date }) =>
  postRepo.getById(new PostId({ value: postIdValue })).then((post) => {
    post.addPieceRate(value, new Day({ value: new Date(date) }));

    return postRepo.save(post);
  });

export default CreatePieceRate;
