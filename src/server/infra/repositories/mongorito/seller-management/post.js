import BaseRepository from './base';

const PostRepository = ({ Model, mapper }) => {
  const baseRepo = BaseRepository({ Model, mapper });

  return Object.freeze({
    ...baseRepo,
  });
};

export default PostRepository;
