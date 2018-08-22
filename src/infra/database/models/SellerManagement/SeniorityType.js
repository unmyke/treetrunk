'use strict';
export default (sequelize, DataTypes) => {
  let SeniorityType = sequelize.define(
    'seniority_type',
    {
      seniority_type_id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      underscored: true,
      indexes: [
        {
          unique: true,
          name: 'unique_seniority_type',
          fields: ['name'],
        },
      ],
      // defaultScope: { include: [{ all: true }] },
    }
  );

  SeniorityType.associate = ({ SeniorityTypeAward }) => {
    SeniorityType.hasMany(SeniorityTypeAward, { as: 'awards' });
  };

  return SeniorityType;
};
