export default (_, { id }, { getPost }) =>
  new Promise((resolve, reject) => {
    if (!postId) {
      return resolve(null);
    }

    const { SUCCESS, ERROR, NOT_FOUND } = getPost.outputs;

    getPost.on(SUCCESS, (post) => resolve(post));
    getPost.on(NOT_FOUND, (err) => reject(err));
    getPost.on(ERROR, (err) => reject(err));

    getPost.execute(postId);
  });
