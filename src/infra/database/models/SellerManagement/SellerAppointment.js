'use strict';
export default (sequelize, DataTypes) => {
  let SellerAppointment = sequelize.define(
    'seller_appointment',
    {
      seller_id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
      },
      post_id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
      },
      day: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      underscored: true,
      indexes: [
        {
          unique: true,
          name: "appointment's sellerId, postId and day",
          fields: ['seller_id', 'post_id', 'day'],
          force: true,
        },
      ],
    }
  );

  SellerAppointment.associate = ({ Seller }) => {
    SellerAppointment.belongsTo(Seller, {
      foreignKey: 'seller_id',
    });
  };

  return SellerAppointment;
};
