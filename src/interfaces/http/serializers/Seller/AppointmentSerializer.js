import { IdSerializer } from '../lib/IdSerializer';

export const AppointmentSerializer = {
  serialize: ({ postId, date }) => {
    return {
      postId: IdSerializer.serialize(postId),
      date,
    };
  }
};
