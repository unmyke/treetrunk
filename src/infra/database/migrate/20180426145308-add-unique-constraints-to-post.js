'use strict';

module.exports = {
  up: (queryInterface) =>
    queryInterface.addIndex('posts', {
      unique: true,
      name: 'uniquePost',
      fields: ['name'],
    }),

  down: (queryInterface) => queryInterface.removeIndex('posts', 'uniquePost'),
};
