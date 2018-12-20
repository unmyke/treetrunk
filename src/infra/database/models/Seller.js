import { Model } from 'mongorito';

export class Seller extends Model {}

Seller.toEmbed = [
  {
    path: 'appointments.post',
    modelName: 'Post',
  },
];
