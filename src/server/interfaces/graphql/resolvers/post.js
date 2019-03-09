export default (_, { id }, ctx) => {
  console.log(id, ctx);
  return ctx.services.SellerManagement.Post.getPost().execute(id);
};
