'use strict';
export default (sequelize, DataTypes) => {
  let SeniorityTypeAward = sequelize.define(
    'seniority_type_award',
    {
      seniority_type_id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      value: {
        primaryKey: true,
        type: DataTypes.FLOAT,
      },
      day: {
        primaryKey: true,
        type: DataTypes.DATE,
      },
    },
    {
      underscored: true,
      indexes: [
        {
          name: "award's seniorityTypeId, value and day",
          fields: ['seniority_type_id', 'value', 'day'],
          unique: true,
          force: true,
        },
      ],
    }
  );

  SeniorityTypeAward.associate = ({ SeniorityType }) => {
    SeniorityTypeAward.belongsTo(SeniorityType, {
      foreignKey: 'seniority_type_id',
    });
  };

  return SeniorityTypeAward;
};
