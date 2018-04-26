'use strict';
export default (sequelize, DataTypes) => {
  var Post = sequelize.define(
    'post',
    {
      postId: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      indexes: [
        {
          unique: true,
          name: 'uniquePostId',
          fields: ['postId'],
        },
        {
          unique: true,
          name: 'uniquePostName',
          fields: ['name'],
        },
      ],
      defaultScope: {
        include: [{ all: true }],
      },
    }
  );
  Post.associate = function(models) {
    Post.hasMany(models.PostPieceRate, {
      foreignKey: 'postId',
      sourceKey: 'postId',
    });
  };
  return Post;
};
