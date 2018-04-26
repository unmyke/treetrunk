'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'sellerAppointments',
      {
        sellerId: {
          allowNull: false,
          type: Sequelize.UUID,
        },
        postId: {
          allowNull: false,
          type: Sequelize.UUID,
        },
        day: {
          allowNull: false,
          type: Sequelize.DATE,
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
    return queryInterface.dropTable('sellerAppointments');
  },
};
