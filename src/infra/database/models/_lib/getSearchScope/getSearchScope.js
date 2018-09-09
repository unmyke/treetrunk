import sequelize from 'sequelize';
const { Op } = sequelize;

export const getSearchScope = (...attrs) => (searchStr) => ({
  where: {
    [Op.or]: attrs.map((attr) => ({
      [attr]: sequelize.where(
        sequelize.fn('LOWER', sequelize.col(attr)),
        'LIKE',
        `%${searchStr.toLowerCase()}%`
      ),
    })),
  },
});
