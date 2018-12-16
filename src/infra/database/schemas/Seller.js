import { Schema } from 'mongoose';

export const SellerSchema = new Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  phone: String,
  state: String,
});

SellerSchema.load = ({ Id, Day }) => {
  SellerSchema.add({
    id: Id,
    appointments: [{ postId: Id, day: Day }],
  });
};
