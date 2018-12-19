import { Model } from 'mongorito';

export class Seller extends Model {}

export const embeds = [
  {
    path: 'appointments.post',
    model: 'Post',
  },
];
