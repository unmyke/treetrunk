'use strict';
export default (sequelize, DataTypes) => {
  let Post = sequelize.define(
    'post',
    {
      post_id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      state: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      underscored: true,
      indexes: [
        {
          unique: true,
          name: 'unique_post',
          fields: ['name'],
        },
      ],
      defaultScope: { include: [{ all: true }] },
    }
  );

  Post.associate = ({ PostPieceRate, SellerAppointment }) => {
    Post.hasMany(PostPieceRate, {
      as: 'piece_rates',
      foreignKey: 'post_id',
    });

    // Post.hasMany(SellerAppointment, {
    //   as: 'seller_appointments',
    //   foreignKey: 'post_id',
    // });
  };

  return Post;
};
