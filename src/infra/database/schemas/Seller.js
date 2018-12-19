import { Schema } from 'mongoose';

export const SellerSchema = new Schema({
  _id: Schema.Types.ObjectId,
  firstName: String,
  middleName: String,
  lastName: String,
  phone: String,
  state: String,
  appointments: [
    {
      postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
      },
      day: Date,
    },
  ],
  createdAt: Date,
  updatedAt: Date,
});
