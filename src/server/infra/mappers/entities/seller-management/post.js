import { addTimestamp } from '../../_lib';
import { PostId as PostIdMapper, Day as DayMapper } from '../../common-types';

const PostMapper = ({ commonTypes, Entity }) => {
  const postIdMapper = PostIdMapper({ Entity, commonTypes });
  const dayMapper = DayMapper({ commonTypes });

  const toDatabase = ({ postId, name, state, pieceRates = [] }) => ({
    postId: postIdMapper.toDatabase(postId),
    name,
    state,
    pieceRates: pieceRates.map(({ value, day }) => ({
      value,
      day: dayMapper.toDatabase(day),
    })),
  });

  const toEntity = ({ postId, name, state, pieceRates = [], ...props }) =>
    Entity.restore({
      postId: postIdMapper.toEntity(postId),
      name,
      state,
      pieceRates: pieceRates.map(({ value, day }) => ({
        value,
        day: dayMapper.toEntity(day),
      })),
      ...props,
    });

  return Object.freeze({
    toEntity,
    toDatabase,
  });
};

export default addTimestamp(PostMapper);
