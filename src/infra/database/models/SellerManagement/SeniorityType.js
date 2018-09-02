'use strict';
import { Op } from 'sequelize';

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
      months: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      state: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      underscored: true,
      indexes: [
        {
          unique: true,
          name: "seniority type's name",
          fields: ['name'],
          force: true,
        },
        {
          unique: true,
          name: "seniority type's months",
          fields: ['months'],
          force: true,
        },
      ],
      scopes: {
        get_all: {
          where: {
            state: {
              [Op.ne]: 'deleted',
            },
          },
        },
        states(states) {
          return {
            where: {
              state: {
                [Op.in]: states,
              },
            },
          };
        },
        include_all: {
          include: [{ all: true }],
        },
      },
    }
  );

  SeniorityType.associate = ({ SeniorityTypeAward }) => {
    SeniorityType.hasMany(SeniorityTypeAward, {
      as: 'awards',
      foreignKey: 'seniority_type_id',
      hooks: true,
      onDelete: 'cascade',
    });
    SeniorityType.addScope('awards', { include: 'awards' });
  };

  return SeniorityType;
};
