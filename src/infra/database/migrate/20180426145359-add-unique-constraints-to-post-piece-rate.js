'use strict';

module.exports = {
  up: (queryInterface) =>
    queryInterface.addIndex('post_piece_rates', {
      unique: true,
      name: "piece rate's postId, value and day",
      fields: ['post_id', 'value', 'day'],
    }),

  down: (queryInterface) =>
    queryInterface.removeIndex(
      'post_piece_rates',
      "piece rate's postId, value and day"
    ),
};
