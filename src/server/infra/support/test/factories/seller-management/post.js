export const Post = (factory, { Post }) => {
  factory.define(
    'post',
    Post,
    {
      post_id: factory.chance('guid', { version: 4 }),
      name: factory.chance('word', { length: 40 }),
      state: factory.chance('pickone', ['active', 'deleted']),
    },
    {
      afterCreate: async function(post, attrs, { pieceRatesCount } = {}) {
        if (
          pieceRatesCount === 0 &&
          attrs.piece_rates &&
          attrs.piece_rates.length === 0
        ) {
          return post.reload({ include: ['piece_rates'] });
        }

        const pieceRateAttrs = {
          post_id: post.post_id,
        };

        const pieceRateFactoryArgs = ['postPieceRate'];

        switch (true) {
          case pieceRatesCount !== undefined && pieceRatesCount > 0:
            pieceRateFactoryArgs.push(pieceRatesCount, pieceRateAttrs);
            break;

          case attrs.piece_rates !== undefined && attrs.piece_rates.length > 0:
            pieceRateFactoryArgs.push(
              attrs.piece_rates.map((attr) => ({
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
          .then(() => post.reload({ include: ['piece_rates'] }));
      },
    }
  );
};
