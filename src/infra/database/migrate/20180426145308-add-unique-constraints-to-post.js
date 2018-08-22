'use strict';

module.exports = {
  up: (queryInterface) =>
    queryInterface.addIndex('posts', {
      unique: true,
      name: 'unique_post',
      fields: ['name'],
    }),

  down: (queryInterface) => queryInterface.removeIndex('posts', 'unique_post'),
};
