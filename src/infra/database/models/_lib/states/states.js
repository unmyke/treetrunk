import { Op } from 'sequelize';

export const states = (states) => ({
  where: {
    state: {
      [Op.in]: states,
    },
  },
});
