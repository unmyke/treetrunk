'use strict';
export default (sequelize, DataTypes) => {
  let PostPieceRate = sequelize.define(
    'post_piece_rate',
    {
      post_id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      value: {
        primaryKey: true,
        type: DataTypes.FLOAT,
      },
      day: {
        primaryKey: true,
        type: DataTypes.DATE,
      },
    },
    {
      underscored: true,
      indexes: [
        {
          name: "piece rate's postId, value and day",
          fields: ['post_id', 'value', 'day'],
          unique: true,
          force: true,
        },
      ],
    }
  );

  PostPieceRate.associate = ({ Post }) => {
    PostPieceRate.belongsTo(Post, {
      foreignKey: 'post_id',
    });
  };

  return PostPieceRate;
};
