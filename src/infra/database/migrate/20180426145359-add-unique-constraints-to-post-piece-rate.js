'use strict';

module.exports = {
  up: (queryInterface) =>
    queryInterface.addIndex('post_piece_rates', {
      unique: true,
      name: 'unique_post_piece_rate',
      fields: ['post_id', 'value', 'day'],
    }),

  down: (queryInterface) =>
    queryInterface.removeIndex('post_piece_rates', 'unique_post_piece_rate'),
};
