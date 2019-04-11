import getPaginationOptions, { types } from './get-pagination-options';
import { getCursorPaginagtion, getOffsetPaginagtion } from './pagination';

export default (Model) => {
  Model.getList = (query = {}) => {
    const { options, type } = getPaginationOptions(query);

    console.log(options, type);

    switch (type) {
      case types.CURSOR:
        return getCursorPaginagtion(options);

      case types.OFFSET:
        return getOffsetPaginagtion(options);

      default:
        throw new Error('Invalid query');
    }
  };
};
