const sellerResolver = (
  _,
  { id },
  {
    services: {
      SellerManagement: {
        Seller: { getSeller },
      },
    },
    serializers: { Seller: sellerSerializer },
  }
) =>
  new Promise((resolve, reject) => {
    const { SUCCESS, ERROR, NOT_FOUND, VALIDATION_ERROR } = getSeller.outputs;

    getSeller
      .on(SUCCESS, (seller) => {
        const serializedSeller = sellerSerializer(seller);
        // const serializedPosts = Object.keys(posts).reduce(
        //   ((prevPosts, postId) => {
        //     const serializedPostId = serializers.id(postId);

        //     return {
        //       ...prevPosts,
        //       [serializedPostId]: serializers.post(posts[postId]),
        //     };
        //   },
        //   {})
        // );
        // const serializedSeniorityType = serializers.seniorityType(
        //   seniorityType
        // );
        // serializedSeller.seniorityType = serializedSeniorityType;
        // serializedSeller.post = serializedPosts[seller.postId];
        // serializedSeller.posts = seller.postIds.map(
        //   (postId) => serializedPosts[postId]
        // );
        resolve(serializedSeller);
      })
      .on(VALIDATION_ERROR, (error) => reject(error))
      .on(NOT_FOUND, (error) => reject(error))
      .on(ERROR, (error) => reject(error));

    getSeller.execute(id);
  });

export default sellerResolver;
