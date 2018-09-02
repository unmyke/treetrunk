export const PostPieceRate = (factory, { PostPieceRate }) => {
  factory.define('postPieceRate', PostPieceRate, {
    value: factory.chance('floating', { min: 0, max: 100, fixed: 2 }),
    day: factory.chance('date'),
  });
};
