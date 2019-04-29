const sellerResolver = (
  _,
  { id },
  { getSeller, mappers: { Seller: sellerMapper } }
) =>
  getSeller
    .execute(id)
    .then(
      ({
        seller: sellerEntity,
        posts: postEntities,
        seniorityTypes: seniorityTypeEntities,
      }) => {
        // const seller =
        seller.post = posts[seller.postId];
        // seller.appointments =
      }
    );

export default sellerResolver;
