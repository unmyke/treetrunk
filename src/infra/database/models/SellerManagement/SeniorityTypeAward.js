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
        type: DataTypes.INTEGER,
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
          name: 'unique_seniority_type_award',
          fields: ['seniority_type_id', 'value', 'day'],
          unique: true,
        },
      ],
    }
  );

  SeniorityTypeAward.associate = ({ SeniorityType }) => {
    SeniorityTypeAward.belongsTo(SeniorityType);
  };

  return SeniorityTypeAward;
};
