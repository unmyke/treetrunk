import { argsParsers } from '../../generators';

const argsParser = (postIds, args, errors) => {
  const [{ filter, ...origArgs }] = argsParsers.getList(args, errors);
  const { fields, text } = filter || {};

  return {
    ...origArgs,
    filter: {
      ...(filter ? filter : {}),
      ...(text ? { text } : {}),
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
