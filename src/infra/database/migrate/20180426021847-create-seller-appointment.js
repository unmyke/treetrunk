'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'seller_appointments',
      {
        seller_id: {
          allowNull: false,
          type: Sequelize.UUID,
        },
        post_id: {
          allowNull: false,
          type: Sequelize.UUID,
        },
        day: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {}
    );
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('seller_appointments');
  },
};
