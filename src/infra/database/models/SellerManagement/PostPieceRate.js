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
          name: 'unique_post_piece_rate',
          fields: ['post_id', 'value', 'day'],
          unique: true,
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
