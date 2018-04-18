import { IdSerializer } from '../lib';

export const SellerIdSerializer = {
  serialize: ({ id }) => ({
    id: IdSerializer.serialize(id),
  })
};