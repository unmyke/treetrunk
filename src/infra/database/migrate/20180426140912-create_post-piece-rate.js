'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'post_piece_rates',
      {
        post_id: {
          allowNull: false,
          type: Sequelize.UUID,
        },
        value: {
          allowNull: false,
          type: Sequelize.FLOAT,
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
    return queryInterface.dropTable('post_piece_rates');
  },
};
