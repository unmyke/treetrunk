'use strict';

module.exports = {
  up: (queryInterface) =>
    queryInterface.addIndex('sellers', {
      unique: true,
      name: "seller's person name and phone",
      fields: ['last_name', 'first_name', 'middle_name', 'phone'],
    }),

  down: (queryInterface) =>
    queryInterface.removeIndex('sellers', "seller's person name and phone"),
};
