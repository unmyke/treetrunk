import BaseRepository from './base';

const PostRepository = ({ Model, mapper, errors }) => {
  const baseRepo = BaseRepository({ Model, mapper, errors });

  return Object.freeze({
    ...baseRepo,
  });
};

export default PostRepository;
