'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'postPieceRates',
      {
        postId: {
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
    return queryInterface.dropTable('postPieceRates');
  },
};
