const UpdatePostPieceRate = ({
  repositories: { Post: postRepo },
  commonTypes: { PostId, Day },
}) => (postIdValue, date, { value: newValue, day: newDate }) =>
  postRepo.getById(new PostId({ value: postIdValue })).then((post) => {
    const day = new Day({ value: new Date(date) });
    const updatedDay = new Day({ value: new Date(newDate) });

    post.updatePieceRateTo(day, newValue, updatedDay);

    return postRepo.save(post);
  });

export default UpdatePostPieceRate;
