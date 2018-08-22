'use strict';

module.exports = {
  up: (queryInterface) =>
    queryInterface.addIndex('seniority_types', {
      unique: true,
      name: 'unique_seniority_type_name',
      fields: ['name'],
    }),

  down: (queryInterface) =>
    queryInterface.removeIndex('seniority_types', 'unique_seniority_type_name'),
};
