import { argsParsers } from '../../generators';

const argsParser = (postIds, args, errors) => {
  const serviceArgs = argsParsers.getList(args, errors);

  return {
    ...serviceArgs,
    filter: {
      ...(serviceArgs.filter ? serviceArgs.filter : {}),
      fields: [
        ...[
          serviceArgs.filter && serviceArgs.filter.fields
            ? serviceArgs.filter.fields
            : [],
        ],
        { postId: postIds },
      ],
    },
  };
};

const getPostsByPostIds = (
  { postIds },
  args,
  { services: { getPostsList }, errors }
) => getPostsList(argsParser(postIds, args, errors));

export default getPostsByPostIds;
