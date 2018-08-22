export const PostPieceRate = (factory, { PostPieceRate }) => {
  factory.define('postPieceRate', PostPieceRate, ({ value, day } = {}) => ({
    value: value || factory.chance('floating', { min: 0, max: 100, fixed: 2 }),
    day: day || factory.chance('date'),
  }));
};
