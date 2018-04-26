'use strict';

module.exports = {
  up: (queryInterface) =>
    queryInterface.addIndex('postPieceRates', {
      unique: true,
      name: 'uniquePostPiece',
      fields: ['postId', 'value', 'day'],
    }),

  down: (queryInterface) =>
    queryInterface.removeIndex('postPieceRates', 'uniquePostPiece'),
};
