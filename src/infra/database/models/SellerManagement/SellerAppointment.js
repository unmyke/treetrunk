'use strict';
export default (sequelize, DataTypes) => {
  let SellerAppointment = sequelize.define(
    'seller_appointment',
    {
      seller_id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      post_id: {
        primaryKey: true,
        type: DataTypes.UUID,
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
          unique: true,
          name: 'unique_seller_appointment',
          fields: ['seller_id', 'post_id', 'day'],
        },
      ],
    }
  );

  SellerAppointment.associate = ({ Seller, Post }) => {
    SellerAppointment.belongsTo(Seller, {
      foreignKey: 'seller_id',
    });
    // SellerAppointment.belongsTo(Post, { foreignKey: 'post_id' });
  };

  return SellerAppointment;
};
