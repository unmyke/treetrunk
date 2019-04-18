import getPaginationOptions, { types } from './get-pagination-options';
import { getCursorPagination, getOffsetPagination } from './pagination';

export default (Model) => {
  Model.getList = (query = {}) => {
    const { options, type } = getPaginationOptions(query);

    switch (type) {
      case types.CURSOR:
        return getCursorPagination(Model, options);

      case types.OFFSET:
        return getOffsetPagination(Model, options);

      default:
        throw new Error('Invalid query');
    }
  };
};
