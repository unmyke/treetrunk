'use strict';
export default (sequelize, DataTypes) => {
  let Seller = sequelize.define(
    'seller',
    {
      seller_id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      first_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      middle_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      last_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      phone: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      underscored: true,
      indexes: [
        {
          unique: true,
          name: 'unique_seller',
          fields: ['last_name', 'first_name', 'middle_name', 'phone'],
        },
      ],
      // defaultScope: { include: [{ all: true }] },
    }
  );

  Seller.associate = ({ SellerAppointment }) => {
    Seller.hasMany(SellerAppointment, {
      as: 'appointments',
      foreignKey: 'seller_id',
    });
  };

  return Seller;
};
