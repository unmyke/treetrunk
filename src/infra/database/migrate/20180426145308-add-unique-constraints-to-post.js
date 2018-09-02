'use strict';

module.exports = {
  up: (queryInterface) =>
    queryInterface.addIndex('posts', {
      unique: true,
      name: "post's name",
      fields: ['name'],
    }),

  down: (queryInterface) => queryInterface.removeIndex('posts', "post's name"),
};
