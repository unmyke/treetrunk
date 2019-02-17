const Post = (factory, { Post }) => {
  factory.define(
    'post',
    Post,
    {
      postId: factory.chance('guid', { version: 4 }),
      name: factory.chance('word', { length: 40 }),
      state: factory.chance('pickone', ['active', 'deleted']),
    },
    {
      async afterCreate(post, attrs, { pieceRatesCount } = {}) {
        if (
          pieceRatesCount === 0 &&
          attrs.pieceRates &&
          attrs.pieceRates.length === 0
        ) {
          return post.reload({ include: ['pieceRates'] });
        }

        const pieceRateAttrs = {
          postId: post.postId,
        };

        const pieceRateFactoryArgs = ['postPieceRate'];

        switch (true) {
          case pieceRatesCount !== undefined && pieceRatesCount > 0:
            pieceRateFactoryArgs.push(pieceRatesCount, pieceRateAttrs);
            break;

          case attrs.pieceRates !== undefined && attrs.pieceRates.length > 0:
            pieceRateFactoryArgs.push(
              attrs.pieceRates.map((attr) => ({
                ...attr,
                ...pieceRateAttrs,
              }))
            );
            break;

          default:
            pieceRateFactoryArgs.push(3, pieceRateAttrs);
            break;
        }

        return factory
          .createMany(...pieceRateFactoryArgs)
          .then(() => post.reload({ include: ['pieceRates'] }));
      },
    }
  );
};

export default Post;
