'use strict';
import { Op } from 'sequelize';
import { getSearchScope, states } from '../_lib';

export default (sequelize, DataTypes) => {
  let Post = sequelize.define(
    'post',
    {
      post_id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      name: {
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
          name: "post's name",
          fields: ['name'],
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
        postIds(post_ids) {
          return {
            where: {
              post_id: {
                [Op.in]: post_ids,
              },
            },
          };
        },
        states,
        search: getSearchScope('name'),
        include_all: {
          include: [{ all: true }],
        },
        include_all: {
          include: [{ all: true }],
        },
      },
    }
  );

  Post.associate = ({ PostPieceRate }) => {
    Post.hasMany(PostPieceRate, {
      as: 'piece_rates',
      foreignKey: 'post_id',
      hooks: true,
      onDelete: 'cascade',
    });
    Post.addScope('piece_rates', { include: 'piece_rates' });
  };

  return Post;
};
