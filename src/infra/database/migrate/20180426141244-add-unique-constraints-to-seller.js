'use strict';

module.exports = {
  up: (queryInterface) =>
    queryInterface.addIndex('sellers', {
      unique: true,
      name: 'unique_seller',
      fields: ['last_name', 'first_name', 'middle_name', 'phone'],
    }),

  down: (queryInterface) =>
    queryInterface.removeIndex('sellers', 'unique_seller'),
};
