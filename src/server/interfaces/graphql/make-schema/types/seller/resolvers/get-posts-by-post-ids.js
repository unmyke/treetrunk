import { argsParsers } from '../../../generators';

const argsParser = (postIds, args, errors) => {
  const [{ filter, ...origArgs }] = argsParsers.getList(args, errors);
  const { fields } = filter || {};

  return {
    ...origArgs,
    filter: {
      ...(filter || {}),
      fields: [
        ...(fields && Array.isArray(fields) ? fields : []),
        { name: 'postId', value: postIds },
      ],
    },
  };
};

const getPostsByPostIds = (
  { postIds },
  args,
  {
    services: { getPostsList },
    errors,
    serializers: { Posts: postsSerializer },
  }
) => {
  const postListArgs = argsParser(postIds, args, errors);

  return getPostsList(postListArgs).then(postsSerializer);
};

export default getPostsByPostIds;
