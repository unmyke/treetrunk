'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'sellers',
      {
        seller_id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
        },
        last_name: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        first_name: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        middle_name: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        phone: {
          allowNull: false,
          type: Sequelize.STRING,
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
    return queryInterface.dropTable('sellers');
  },
};
