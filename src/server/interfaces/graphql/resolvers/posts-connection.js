const onSuccess = ({ result: posts, cursor, hasMore }) => {
  return { posts, cursor, hasMore };
};

export default (
  _,
  { pageSize, after, sort, order },
  {
    services: {
      SellerManagement: {
        Post: { getPosts },
      },
    },
  }
) => {
  const { SUCCESS, ERROR } = getPosts.outputs;
  getPosts.on(SUCCESS, onSuccess).on(ERROR, onError);

  const { result: posts, cursor, hasMore } = getPosts.execute({
    pageSize,
    after,
    sort,
    order,
  });

  return {
    posts,
    cursor,
    hasMore,
  };
};
