'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'sellers',
      {
        sellerId: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
        },
        lastName: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        firstName: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        middleName: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {}
    );
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('sellers');
  },
};
