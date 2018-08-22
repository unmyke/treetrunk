'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'seniority_types',
      {
        seniority_type_id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
        },
        name: {
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
    return queryInterface.dropTable('seniority_types');
  },
};
