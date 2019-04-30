const postResolver = (_, { id }, { getPost }) =>
  new Promise((resolve, reject) => {
    const { SUCCESS, ERROR, NOT_FOUND } = getPost.outputs;

    getPost.on(SUCCESS, (post) => resolve(post));
    getPost.on(NOT_FOUND, (err) => reject(err));
    getPost.on(ERROR, (err) => reject(err));

    getPost.execute(id);
  });

export default postResolver;
