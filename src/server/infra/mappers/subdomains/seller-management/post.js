import { PostId as PostIdMapper, Day as DayMapper } from '../../common-types';

const PostMapper = ({ commonTypes, Entity }) => {
  const postIdMapper = PostIdMapper({ Entity, commonTypes });
  const dayMapper = DayMapper({ commonTypes });

  const toDatabase = ({ postId, name, state, pieceRates }) => {
    return {
      postId: postIdMapper.toDatabase(postId),
      name,
      state,
      pieceRates: pieceRates.map(({ value, day }) => ({
        value,
        day: dayMapper.toDatabase(day),
      })),
    };
  };

  const toEntity = ({ postId, name, state, pieceRates }) => {
    return Entity.restore({
      postId: postIdMapper.toEntity(postId),
      name,
      state,
      pieceRates: pieceRates.map(({ value, day }) => ({
        value,
        day: dayMapper.toEntity(day),
      })),
    });
  };

  return Object.freeze({
    toEntity,
    toDatabase,
  });
};

export default PostMapper;
