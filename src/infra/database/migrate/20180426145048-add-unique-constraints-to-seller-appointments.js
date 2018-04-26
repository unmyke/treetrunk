'use strict';

module.exports = {
  up: (queryInterface) =>
    queryInterface.addIndex('sellerAppointments', {
      unique: true,
      name: 'uniqueSellerAppointment',
      fields: ['sellerId', 'postId', 'day'],
    }),

  down: (queryInterface) =>
    queryInterface.removeIndex('sellerAppointments', 'uniqueSellerAppointment'),
};
