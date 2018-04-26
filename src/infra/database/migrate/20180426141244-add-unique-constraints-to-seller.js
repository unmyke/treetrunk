'use strict';

module.exports = {
  up: (queryInterface) =>
    queryInterface.addIndex('sellers', {
      unique: true,
      name: 'uniqueSeller',
      fields: ['lastname', 'firstName', 'middleName', 'phone'],
    }),

  down: (queryInterface) =>
    queryInterface.removeIndex('sellers', 'uniqueSeller'),
};
