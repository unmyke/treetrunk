'use strict';
export default (sequelize, DataTypes) => {
  let SellerAppointment = sequelize.define(
    'sellerAppointment',
    {
      postId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      day: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {}
  );
  SellerAppointment.associate = function(models) {
    SellerAppointment.belongsTo(models.Seller, {
      foreignKey: 'sellerId',
      targetKey: 'sellerId',
    });
  };
  return SellerAppointment;
};
