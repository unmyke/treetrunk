import { PAGINATION_TYPES } from '@common';

const getResultByType = (type, { models, hasBefore, hasAfter }) =>
  type === PAGINATION_TYPES.FORWARD
    ? { models, hasBefore, hasAfter }
    : { models: models.reverse(), hasBefore: hasAfter, hasAfter: hasBefore };

export default getResultByType;
