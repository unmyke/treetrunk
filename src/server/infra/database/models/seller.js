import { Model } from 'mongorito';

export default class Seller extends Model {}

Seller.toEmbed = [
  {
    path: 'appointments.post',
    modelName: 'Post',
  },
];
