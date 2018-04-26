'use strict';
export default (sequelize, DataTypes) => {
  var PostPieceRate = sequelize.define(
    'postPieceRate',
    {
      value: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      day: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {}
  );
  PostPieceRate.associate = function(models) {
    PostPieceRate.belongsTo(models.Post, {
      foreignKey: 'postId',
      targetKey: 'postId',
    });
  };
  return PostPieceRate;
};
