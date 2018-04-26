'use strict';
export default (sequelize, DataTypes) => {
  var Appointment = sequelize.define(
    'appointment',
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
  Appointment.associate = function(models) {
    Appointment.belongsTo(models.Seller, {
      foreignKey: 'sellerId',
      targetKey: 'sellerId',
    });
  };
  return Appointment;
};
