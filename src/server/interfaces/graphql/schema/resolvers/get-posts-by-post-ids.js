import { parseConnectionInput } from './_lib';

const getPostsByPostIds = (
  { postIds },
  args,
  {
    services: {
      SellerManagement: {
        Post: { getPostsList },
      },
    },
    serializers: { Post: postSerializer },
  }
) =>
  new Promise((resolve, reject) => {
    const { skip, type, id, count, filter, sort } = parseConnectionInput(args);

    const { SUCCESS, ERROR, NOT_FOUND } = getPostsList.outputs;

    getPostsList.on(SUCCESS, (posts) => resolve(posts.map(postSerializer)));
    getPostsList.on(NOT_FOUND, (err) => reject(err));
    getPostsList.on(ERROR, (err) => reject(err));

    getPostsList.execute({
      skip,
      type,
      id,
      count,
      sort,
      filter: { fields: [{ postId: postIds }, ...filter.fields] },
    });
  });

export default getPostsByPostIds;
