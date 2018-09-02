'use strict';

module.exports = {
  up: (queryInterface) =>
    queryInterface.addIndex('seller_appointments', {
      unique: true,
      name: "appointment's sellerId, postId and day",
      fields: ['seller_id', 'post_id', 'day'],
    }),

  down: (queryInterface) =>
    queryInterface.removeIndex(
      'seller_appointments',
      "appointment's sellerId, postId and day"
    ),
};
