import { parseConnectionInput } from './_lib';

const postIdResolver = (
  { postIds },
  args,
  { services: { getPostsByIds }, errors }
) => {
  const { type, id, count } = parseConnectionInput(args, errors);

  return getPostsByIds(postIds, { type, id, count });
};

export default postIdResolver;
