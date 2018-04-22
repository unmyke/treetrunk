import { IdSerializer } from '../_lib';
import { PieceRateSerializer } from './PieceRateSerializer';

export const PostSerializer = {
  serialize: ({ id, name, pieceRates }) => ({
    id: IdSerializer.serialize(id),
    name,
    appointments: pieceRates.map(PieceRateSerializer.serialize),
  })
};
