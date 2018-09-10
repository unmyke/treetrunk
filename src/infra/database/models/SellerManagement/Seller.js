'use strict';
import { Op } from 'sequelize';
import { getSearchScope, states } from '../_lib';

export default (sequelize, DataTypes) => {
  let Seller = sequelize.define(
    'seller',
    {
      seller_id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      first_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      middle_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      last_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      phone: {
        allowNull: false,
        type: DataTypes.STRING,
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
          name: "seller's person name and phone",
          fields: ['last_name', 'first_name', 'middle_name', 'phone'],
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
        states,
        search: getSearchScope(
          'last_name',
          'first_name',
          'middle_name',
          'phone'
        ),
        include_all: {
          include: [{ all: true }],
        },
      },
      setterMethods: {
        updateAppointments(appointments) {
          return this.removeAppointments().then(function() {
            return this.addAppointments(appointments);
          });
        },
      },
    }
  );

  Seller.associate = ({ SellerAppointment }) => {
    Seller.hasMany(SellerAppointment, {
      as: 'appointments',
      foreignKey: 'seller_id',
      hooks: true,
      onDelete: 'cascade',
    });
    Seller.addScope('appointments', { include: 'appointments' });
    // Seller.addScope('postId', function(post_id) {
    //   return {
    //     where: {
    //       appointments: {
    //         [op.eq]: sequelize.fn('max', sequelize.col('day')
    //         post_id: {
    //           ,
    //         },
    //       },
    //     },
    //     include: 'appointments',
    //   };
    // });
  };

  return Seller;
};
