'use strict';

module.exports = {
  up: (queryInterface) =>
    Promise.all([
      queryInterface.addIndex('seniority_types', {
        unique: true,
        name: "seniority type's name",
        fields: ['name'],
      }),
      queryInterface.addIndex('seniority_types', {
        unique: true,
        name: "seniority type's months",
        fields: ['months'],
      }),
    ]),

  down: (queryInterface) =>
    Promise.all([
      queryInterface.removeIndex('seniority_types', "seniority type's name"),
      queryInterface.removeIndex('seniority_types', "seniority type's months"),
    ]),
};
