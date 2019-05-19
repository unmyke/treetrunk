const Create = ({
  entities: { Post },
  repositories: { Post: postRepo },
  commonTypes: { Day },
}) => ({ post: { name }, pieceRate }) => {
  const newPost = new Post({ name });

  if (pieceRate) {
    const { value, day: awardDate } = pieceRate;
    newPost.addPieceRate(value, new Day({ value: awardDate }));
  }

  return postRepo.save(newPost);
};

export default Create;
