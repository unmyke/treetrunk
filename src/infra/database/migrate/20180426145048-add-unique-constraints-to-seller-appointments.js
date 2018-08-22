'use strict';

module.exports = {
  up: (queryInterface) =>
    queryInterface.addIndex('seller_appointments', {
      unique: true,
      name: 'unique_seller_appointment',
      fields: ['seller_id', 'post_id', 'day'],
    }),

  down: (queryInterface) =>
    queryInterface.removeIndex(
      'seller_appointments',
      'unique_seller_appointment'
    ),
};
