import { IdSerializer } from '../lib/IdSerializer';

export const AppointmentSerializer = {
  serialize: ({ postId, date }) => {
    return {
      postId: idSerializer.serialize(postId),
      date,
    }
  }
};