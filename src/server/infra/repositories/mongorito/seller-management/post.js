import { getIdValue } from '@infra/_lib';
import BaseRepository from '../base';

const PostRepository = ({
  commonTypes: { PostId },
  Entity,
  Model,
  mapper,
  errors,
}) => {
  const baseRepo = BaseRepository({ Entity, Model, mapper, errors });

  const getList = (opts) =>
    baseRepo
      .getList(opts, { postId: { $ne: getIdValue(PostId.dismissPostId) } })
      .then(({ entities, ...meta }) => ({
        entities: entities.filter((post) => !post.isDismissPost()),
        ...meta,
      }));

  return Object.freeze({
    ...baseRepo,
    getList,
  });
};

export default PostRepository;
