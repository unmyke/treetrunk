import getPaginationOptions, { types } from './get-pagination-options';
import { getCursorPaginagtion, getOffsetPaginagtion } from './pagination';

export default (Model) => {
  Model.getList = (query = {}) => {
    const { options, type } = getPaginationOptions(query);

    switch (type) {
      case types.CURSOR:
        return getCursorPaginagtion(Model, options);

      case types.OFFSET:
        return getOffsetPaginagtion(Model, options);

      default:
        throw new Error('Invalid query');
    }
  };
};
