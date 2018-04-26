'use strict';
export default (sequelize, DataTypes) => {
  var Seller = sequelize.define(
    'seller',
    {
      sellerId: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      firstName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      middleName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      getterMethods: {
        personName() {
          return {
            firstName: this.firstName,
            middleName: this.middleName,
            lastName: this.lastName,
          };
        },
      },
      setterMethods: {
        personName({ firstName, middleName, lastName }) {
          this.setDataValue('firstName', firstName);
          this.setDataValue('middleName', middleName);
          this.setDataValue('lastName', lastName);
        },
      },

      indexes: [
        {
          unique: true,
          name: 'uniqueSeller',
          fields: ['sellerId'],
        },
      ],
      defaultScope: {
        include: [{ all: true }],
      },
    }
  );
  Seller.associate = function(models) {
    Seller.hasMany(models.Appointment, {
      foreignKey: 'sellerId',
      sourceKey: 'sellerId',
    });
  };
  return Seller;
};
