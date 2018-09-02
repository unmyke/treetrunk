'use strict';

module.exports = {
  up: (queryInterface) =>
    queryInterface.addIndex('seniority_type_awards', {
      unique: true,
      name: "award's seniorityTypeId, value and day",
      fields: ['seniority_type_id', 'value', 'day'],
    }),

  down: (queryInterface) =>
    queryInterface.removeIndex(
      'seniority_type_awards',
      "award's seniorityTypeId, value and day"
    ),
};
