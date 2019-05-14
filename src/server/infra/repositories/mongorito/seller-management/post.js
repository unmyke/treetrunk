import BaseRepository from '../base';

const PostRepository = ({ Entity, Model, mapper, errors }) => {
  const baseRepo = BaseRepository({ Entity, Model, mapper, errors });

  const getList = (opts) =>
    baseRepo.getList(opts).then(({ entities, ...meta }) => ({
      entities: entities.filter((post) => !post.isDismissPost()),
      ...meta,
    }));

  return Object.freeze({
    ...baseRepo,
    getList,
  });
};

export default PostRepository;
