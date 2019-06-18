const argsParser = ({ argsParsers }) => (postIds, args, errors) => {
  const [{ filter, ...origArgs }] = argsParsers.list(args, errors);
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

const getPostsByPostIds = () => (
  { postIds },
  args,
  {
    dataSources: {
      services: { getPostsList },
    },
    serializers: { Posts: postsSerializer },
    errors,
  }
) => {
  const postListArgs = argsParser(postIds, args, errors);
  return getPostsList(postListArgs).then(postsSerializer);
};

export default getPostsByPostIds;